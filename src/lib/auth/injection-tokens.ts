import { InjectionToken } from "@angular/core";

export const AUTH_LOG_IN_ENDPOINT = new InjectionToken<string>("Authentication Log In Endpoint");
export const AUTH_LOG_OUT_ENDPOINT = new InjectionToken<string>("Authentication Log Out Endpoint");
export const AUTH_REFRESH_TOKEN_ENDPOINT = new InjectionToken<string>("Authentication Refresh Token Endpoint");
export const AUTH_SIGN_UP_ENDPOINT = new InjectionToken<string>("Authentication Sign Up Endpoint");
export const AUTH_USER_PROFILE_ENDPOINT = new InjectionToken<string>("Authentication User Profile Fetch Endpoint");
export const EMAIL_VERIFICATION_ENDPOINT = new InjectionToken<string>("E-mail Verification Endpoint");
export const EMAIL_VERIFICATION_RESEND_ENDPOINT = new InjectionToken<string>("E-mail Verification Resend Endpoint");
export const EMAIL_VERIFICATION_ROUTE = new InjectionToken<string>("E-mail Verification Route");
export const IGNORE_REDIRECT_FROM = new InjectionToken<string[]>("Endpoints to ignore Unauthorized signals to redirect");
export const LOG_IN_ROUTE = new InjectionToken<string>("Log In Route");
export const PASSWORD_CHANGE_ENDPOINT = new InjectionToken<string>("Password Change Endpoint");
export const PASSWORD_RESET_ENDPOINT = new InjectionToken<string>("Password Request Endpoint");
export const PASSWORD_RESET_REQUEST_ENDPOINT = new InjectionToken<string>("Password Reset Request Endpoint");
export const PASSWORD_RESET_REQUEST_ROUTE = new InjectionToken<string>("Password Reset Request Route");
export const PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT = new InjectionToken<string>("Password Reset Token Validation Endpoint");
export const SIGN_UP_ROUTE = new InjectionToken<string>("Sign Up Route");
export const USER_DASHBOARD_ROUTE = new InjectionToken<string>("User Dashboard Route");

export const SPARKLER_AUTH_DEFAULTS = [
  { provide: AUTH_LOG_IN_ENDPOINT, useValue: "/accounts/login" },
  { provide: AUTH_LOG_OUT_ENDPOINT, useValue: "/accounts/logout" },
  { provide: AUTH_REFRESH_TOKEN_ENDPOINT, useValue: "/accounts/refresh-token" },
  { provide: AUTH_SIGN_UP_ENDPOINT, useValue: "/accounts/signup" },
  { provide: AUTH_USER_PROFILE_ENDPOINT, useValue: "/me" },
  { provide: EMAIL_VERIFICATION_ENDPOINT, useValue: "/email/verify" },
  { provide: EMAIL_VERIFICATION_RESEND_ENDPOINT, useValue: "/email/resend" },
  { provide: EMAIL_VERIFICATION_ROUTE, useValue: "/email/verify" },
  { provide: IGNORE_REDIRECT_FROM, useValue: ["/me"] },
  { provide: LOG_IN_ROUTE, useValue: "/accounts/login" },
  { provide: PASSWORD_CHANGE_ENDPOINT, useValue: "/password/change" },
  { provide: PASSWORD_RESET_ENDPOINT, useValue: "/password/reset" },
  { provide: PASSWORD_RESET_REQUEST_ENDPOINT, useValue: "/password/email" },
  { provide: PASSWORD_RESET_REQUEST_ROUTE, useValue: "/password/reset" },
  { provide: PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT, useValue: "/password/validate-token" },
  { provide: SIGN_UP_ROUTE, useValue: "/accounts/signup" },
  { provide: USER_DASHBOARD_ROUTE, useValue: "/accounts/dashboard" }
];
