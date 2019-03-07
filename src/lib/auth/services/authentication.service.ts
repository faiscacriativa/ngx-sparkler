import { Injectable, Inject, isDevMode } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";

import { ApiResponse } from "../../core/interfaces/api-response";
import { HttpService } from "../../core/services/http.service";

import { AccessToken } from "../interfaces/access-token";
import { Credentials } from "../interfaces/credentials";
import { User } from "../interfaces/user";
import {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_LOG_OUT_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  AUTH_SIGN_UP_ENDPOINT,
  AUTH_USER_PROFILE_ENDPOINT,
  USER_DASHBOARD_ROUTE
} from "../injection-tokens";

const GuestUser: User = {
  avatar: "",
  first_name: "general.guest"
};

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

  public get user(): BehaviorSubject<User> {
    return this.user$;
  }

  private get userProfile(): User {
    const userProfile = localStorage.getItem("user_profile");
    return userProfile ? JSON.parse(userProfile) : GuestUser;
  }

  public redirectTo: string;

  private authenticated$ = new BehaviorSubject<boolean>(false);
  private user$ = new BehaviorSubject<User>(GuestUser);

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
    this.translate.stream(GuestUser.first_name)
      .subscribe((value) => GuestUser.first_name = value);

    this.user$.next(this.userProfile);

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

          return of(GuestUser);
        }),
        map((response: ApiResponse) => this.storeUserData(response.data as User))
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
          this.redirect();

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
    localStorage.removeItem("user_profile");

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

  private storeUserData(user: User): User {
    if (!user) {
      return undefined;
    }

    localStorage.setItem("user_profile", JSON.stringify(user));

    this.user$.next(user);
    this.authenticated$.next(true);

    return user;
  }

  private redirect() {
    let redirectTarget = this.userDashboardRoute;

    if (this.redirectTo) {
      redirectTarget = this.redirectTo;
      this.redirectTo = undefined;
    }

    this.router.navigateByUrl(redirectTarget);
  }

}
