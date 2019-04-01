import { Inject, Injectable, isDevMode } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";

import { ApiResponse, HttpService } from "../../core/index";

import {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_LOG_OUT_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  AUTH_SIGN_UP_ENDPOINT,
  AUTH_USER_PROFILE_ENDPOINT,
  USER_DASHBOARD_ROUTE
  } from "../injection-tokens";
import { AccessToken, Credentials, User } from "../interfaces/index";

const GuestUser: User = ({ profile: { first_name: "general.guest" } } as User);

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  public get accessToken(): string {
    return AuthenticationService.getAccessToken();
  }

  public get isAuthenticated(): BehaviorSubject<boolean> {
    return this.authenticated$;
  }

  public get isVerified(): BehaviorSubject<boolean> {
    return this.verified$;
  }

  public get user(): BehaviorSubject<User> {
    return this.user$;
  }

  public redirectTo: string;

  private authenticated$ = new BehaviorSubject<boolean>(false);
  private user$ = new BehaviorSubject<User>(GuestUser);
  private verified$ = new BehaviorSubject<boolean>(false);

  public static getAccessToken(): string {
    return localStorage.getItem("access_token");
  }

  constructor(
    @Inject(AUTH_LOG_IN_ENDPOINT) private logInEndpoint: string,
    @Inject(AUTH_LOG_OUT_ENDPOINT) private logOutEndpoint: string,
    @Inject(AUTH_REFRESH_TOKEN_ENDPOINT) private refreshTokenEndpoint: string,
    @Inject(AUTH_SIGN_UP_ENDPOINT) private signUpEndpoint: string,
    @Inject(AUTH_USER_PROFILE_ENDPOINT) private userProfileEndpoint: string,
    @Inject(USER_DASHBOARD_ROUTE) private userDashboardRoute: string,
    private http: HttpService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.stream(GuestUser.profile.first_name)
      .subscribe((value) => GuestUser.profile.first_name = value);

    this.logInEndpoint = logInEndpoint.replace(/^\//, "");
    this.logOutEndpoint = logOutEndpoint.replace(/^\//, "");
    this.signUpEndpoint = signUpEndpoint.replace(/^\//, "");
    this.refreshTokenEndpoint = refreshTokenEndpoint.replace(/^\//, "");
    this.userProfileEndpoint = userProfileEndpoint.replace(/^\//, "");
  }

  public fetchUser(): Observable<User> {
    return this.http.get(`/${this.userProfileEndpoint}`)
      .pipe(
        catchError((error) => {
          this.user$.next(GuestUser);
          this.authenticated$.next(false);

          if (isDevMode()) {
            console.log(error);
          }

          return of(null);
        }),
        map((response: ApiResponse) => {
          if (!response) {
            return GuestUser;
          }

          const user = response.data as User;

          this.user$.next(user);
          this.authenticated$.next(true);
          this.verified$.next(!!user.email_verified_at);

          return user;
        })
      );
  }

  public login(credentials: Credentials): Observable<User> {
    return this.http.post(`/${this.logInEndpoint}`, credentials)
      .pipe(
        map((response: ApiResponse) => this.storeTokenData(response.data as AccessToken)),
        mergeMap(() => this.fetchUser()),
        map((user: User) => {
          this.user$.next(user);
          this.authenticated$.next(true);

          return user;
        })
      );
  }

  public logout(additionalData: any = { }): Observable<ApiResponse> {
    if (!this.accessToken) {
      this.clearStoredData();

      return of({ error: false, message: "Ok" } as ApiResponse);
    }

    additionalData.jti = this.getJti();

    return this.http.post(`/${this.logOutEndpoint}`, additionalData)
      .pipe(map((response: ApiResponse) => {
        if (!response.error) {
          this.clearStoredData();
        }

        return response;
      }));
  }

  public redirect(): Promise<boolean> {
    let redirectTarget: string = this.userDashboardRoute;

    // An redirectTo is being defined intermittently.
    // A log is set here to investigate this case.
    // TODO: Remove this statements after debug.
    if (isDevMode) {
      console.log("Will redirect to: " + this.redirectTo);
    }

    if (this.redirectTo) {
      const rediretUrl = new URL(this.redirectTo);

      redirectTarget  = `${rediretUrl.pathname}${rediretUrl.search}`;
      this.redirectTo = undefined;
    }

    return this.router.navigateByUrl(redirectTarget);
  }

  public refreshAccessToken(): Observable<AccessToken> {
    let newAccessToken: AccessToken;

    return this.http
      .post(
        `/${this.refreshTokenEndpoint}`,
        { refresh_token: this.getRefreshToken() })
      .pipe(
        map((response: ApiResponse) => this.storeTokenData(response.data as AccessToken)),
        mergeMap((accessToken: AccessToken) => {
          newAccessToken = accessToken;
          return this.fetchUser();
        }),
        map((user: User) => {
          this.user$.next(user);
          this.authenticated$.next(true);

          return newAccessToken;
        })
      );
  }

  public signup(userData: User): Observable<ApiResponse> {
    return this.http.post(`/${this.signUpEndpoint}`, userData);
  }

  private getJwtClaims(accessToken: string) {
    const payload = accessToken.split(".")[1].replace("-", "+").replace("_", "/");
    const claims = JSON.parse(window.atob(payload));

    return claims;
  }

  private getJti() {
    const claims = this.getJwtClaims(this.accessToken);

    return claims.jti;
  }

  private getRefreshToken(): string {
    return localStorage.getItem("refresh_token");
  }

  private clearStoredData(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("refresh_token");

    this.user$.next(GuestUser);
    this.authenticated$.next(false);
  }

  private storeTokenData(token: AccessToken): AccessToken {
    const claims = this.getJwtClaims(token.access_token);

    localStorage.setItem("access_token", token.access_token);
    localStorage.setItem("expires_in", (claims.exp * 1000).toString());
    localStorage.setItem("refresh_token", token.refresh_token);

    return token;
  }

}
