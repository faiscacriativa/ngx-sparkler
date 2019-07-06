import { HTTP_INTERCEPTORS, HttpInterceptor } from "@angular/common/http";
import { async, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { API_URL } from "../core";

import { SparklerAuthModule } from "./auth.module";
import {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_LOG_OUT_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  AUTH_SIGN_UP_ENDPOINT,
  AUTH_USER_PROFILE_ENDPOINT,
  EMAIL_VERIFICATION_ENDPOINT,
  EMAIL_VERIFICATION_RESEND_ENDPOINT,
  EMAIL_VERIFICATION_ROUTE,
  IGNORE_REDIRECT_FROM,
  LOG_IN_ROUTE,
  PASSWORD_CHANGE_ENDPOINT,
  PASSWORD_RESET_ENDPOINT,
  PASSWORD_RESET_REQUEST_ENDPOINT,
  PASSWORD_RESET_REQUEST_ROUTE,
  PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT,
  SIGN_UP_ROUTE,
  USER_DASHBOARD_ROUTE
} from "./injection-tokens";
import { User } from "./interfaces";
import { AuthenticationService } from "./services";

describe("SparklerAuthModule", () => {
  beforeEach(async(() => {
    const fakeAuthenticationService = jasmine.createSpyObj<AuthenticationService>("AuthenticationService", ["fetchUser"]);
    fakeAuthenticationService.fetchUser.and.callFake(() => of({ id: 0, email: "user@email.com" } as User));

    TestBed.configureTestingModule({
      imports: [SparklerAuthModule.forRoot()],
      providers: [
        { provide: API_URL, useValue: "http://localhost:8000" },
        { provide: AuthenticationService, useValue: fakeAuthenticationService }
      ]
    });
  }));

  describe("forRoot", () => {
    it("should provide defaults values for injection tokens", async(() => {
      const authLoginEndpoint: string = TestBed.get(AUTH_LOG_IN_ENDPOINT);
      const authLogoutEndpoint: string = TestBed.get(AUTH_LOG_OUT_ENDPOINT);
      const authRefreshTokenEndpoint: string = TestBed.get(AUTH_REFRESH_TOKEN_ENDPOINT);
      const authSignupEndpoint: string = TestBed.get(AUTH_SIGN_UP_ENDPOINT);
      const authUserProfileEndpoint: string = TestBed.get(AUTH_USER_PROFILE_ENDPOINT);
      const emailVerificationEndpoint: string = TestBed.get(EMAIL_VERIFICATION_ENDPOINT);
      const emailVerificationResendEndpoint: string = TestBed.get(EMAIL_VERIFICATION_RESEND_ENDPOINT);
      const emailVerificationRoute: string = TestBed.get(EMAIL_VERIFICATION_ROUTE);
      const ignoreRedirectFrom = TestBed.get(IGNORE_REDIRECT_FROM);
      const loginRoute = TestBed.get(LOG_IN_ROUTE);
      const passwordChangeEndpoint: string = TestBed.get(PASSWORD_CHANGE_ENDPOINT);
      const passwordResetEndpoint: string = TestBed.get(PASSWORD_RESET_ENDPOINT);
      const passwordResetRequestEndpoint: string = TestBed.get(PASSWORD_RESET_REQUEST_ENDPOINT);
      const passwordResetRequestRoute: string = TestBed.get(PASSWORD_RESET_REQUEST_ROUTE);
      const passwordResetTokenValidationEndpoint: string = TestBed.get(PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT);
      const signupRoute: string = TestBed.get(SIGN_UP_ROUTE);
      const userDashboardRoute: string = TestBed.get(USER_DASHBOARD_ROUTE);

      expect(authLoginEndpoint).toBe("/accounts/login");
      expect(authLogoutEndpoint).toBe("/accounts/logout");
      expect(authRefreshTokenEndpoint).toBe("/accounts/refresh-token");
      expect(authSignupEndpoint).toBe("/accounts/signup");
      expect(authUserProfileEndpoint).toBe("/me");
      expect(emailVerificationEndpoint).toBe("/email/verify");
      expect(emailVerificationResendEndpoint).toBe("/email/resend");
      expect(emailVerificationRoute).toBe("/email/verify");
      expect(ignoreRedirectFrom).toEqual(["/me"]);
      expect(loginRoute).toBe("/accounts/login");
      expect(passwordChangeEndpoint).toBe("/password/change");
      expect(passwordResetEndpoint).toBe("/password/reset");
      expect(passwordResetRequestEndpoint).toBe("/password/email");
      expect(passwordResetRequestRoute).toBe("/password/reset");
      expect(passwordResetTokenValidationEndpoint).toBe("/password/validate-token");
      expect(signupRoute).toBe("/accounts/signup");
      expect(userDashboardRoute).toBe("/accounts/dashboard");
    }));

    it("should fetch user at initialization", async(() => {
      const authentication: jasmine.SpyObj<AuthenticationService> = TestBed.get(AuthenticationService);
      expect(authentication.fetchUser).toHaveBeenCalled();
    }));

    it("should provide HTTP interceptors", () => {
      const interceptors = TestBed.get(HTTP_INTERCEPTORS);

      let found = 0;

      interceptors.forEach((interceptor: HttpInterceptor) => {
        switch (interceptor.constructor.name) {
          case "AccessTokenInterceptor": ++found; break;
          case "RefreshTokenInterceptor": ++found;
        }
      });

      expect(found).toBe(2);
    });
  });
});
