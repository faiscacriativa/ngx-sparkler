import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, switchMap, take, filter } from "rxjs/operators";

import { API_URL } from "../../core/services/http.service";

import {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  LOG_IN_ROUTE
} from "../injection-tokens";
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
    @Inject(LOG_IN_ROUTE) private loginRoute: string,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.apiUrl = this.apiUrl.replace(/\/$/, "");
    this.logInEndpoint = this.logInEndpoint.replace(/^\//, "");
    this.refreshTokenEndpoint = this.refreshTokenEndpoint.replace(/^\//, "");
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
                  this.auth.redirectTo = location.pathname;
                  this.router.navigateByUrl(this.loginRoute);
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

}
