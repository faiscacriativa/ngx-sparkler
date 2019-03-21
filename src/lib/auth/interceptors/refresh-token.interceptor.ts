import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Inject, Injectable, isDevMode } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import {
  catchError,
  filter,
  switchMap,
  take
} from "rxjs/operators";

import { API_URL } from "../../core/services/http.service";
import { AUTH_LOG_IN_ENDPOINT, AUTH_REFRESH_TOKEN_ENDPOINT, IGNORE_REDIRECT_FROM } from "../injection-tokens";
import { AccessToken } from "../interfaces/access-token";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  private accessToken$ = new BehaviorSubject<any>(null);
  private refreshInProgress = false;

  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(AUTH_LOG_IN_ENDPOINT) private logInEndpoint: string,
    @Inject(AUTH_REFRESH_TOKEN_ENDPOINT) private refreshTokenEndpoint: string,
    @Inject(IGNORE_REDIRECT_FROM) private ignoreRedirectFrom: string[],
    private auth: AuthenticationService
  ) {
    this.sanitizeEndpointsAndUrls();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(this.apiUrl)) {
      return next.handle(request);
    }

    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(error);
        }

        if (
          request.url.includes(this.logInEndpoint) ||
          request.url.includes(this.refreshTokenEndpoint)
        ) {
          if (request.url.includes(this.refreshTokenEndpoint)) {
            this.auth.logout().subscribe();
          }

          return throwError(error);
        }

        if (this.refreshInProgress) {
          return this.accessToken$
            .pipe(
              filter(value => value !== null),
              take(1),
              switchMap(() => next.handle(this.addAccessToken(request)))
            );
        } else {
          this.refreshInProgress = true;
          this.accessToken$.next(null);

          return this.auth
            .refreshAccessToken()
            .pipe(
              switchMap((accessToken: AccessToken) => {
                this.refreshInProgress = false;
                this.accessToken$.next(accessToken.access_token);

                return next.handle(this.addAccessToken(request));
              }),
              catchError((refreshError) => {
                this.refreshInProgress = false;
                this.auth.logout().subscribe(() => {
                  if (!this.isIgnoredUrl(request)) {
                    // TODO: Remove this statements after debug.
                    if (isDevMode()) {
                      console.log("Original request URL: " + request.urlWithParams);
                      console.log("Setting Redirect To: " + location.pathname);
                    }

                    this.auth.redirectTo = location.pathname;
                  }
                });

                return throwError(refreshError);
              })
            );
        }
      }));
  }

  private addAccessToken(request: HttpRequest<any>) {
    const accessToken = this.auth.accessToken;

    if (!accessToken) {
      return request;
    }

    return request.clone({
      headers: request.headers.set("Authorization", `Bearer ${accessToken}`)
    });
  }

  private isIgnoredUrl(request: HttpRequest<any>) {
    const url = new URL(request.urlWithParams);

    return this.ignoreRedirectFrom.every((value) => {
      return url.pathname.startsWith(`/${value}`);
    });
  }

  private sanitizeEndpointsAndUrls() {
    this.apiUrl = this.apiUrl.replace(/\/$/, "");
    this.logInEndpoint = this.logInEndpoint.replace(/^\//, "");
    this.refreshTokenEndpoint = this.refreshTokenEndpoint.replace(/^\//, "");

    const sanitizedIgnoreRedirectFrom = [];
    this.ignoreRedirectFrom.forEach((item) => {
      sanitizedIgnoreRedirectFrom.push(item.replace(/^\//, ""));
    });

    this.ignoreRedirectFrom = sanitizedIgnoreRedirectFrom;
  }

}
