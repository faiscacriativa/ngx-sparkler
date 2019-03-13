import { InjectionToken } from "@angular/core";

export const AUTH_LOG_IN_ENDPOINT = new InjectionToken<string>("Authentication Log In Endpoint");
export const AUTH_LOG_OUT_ENDPOINT = new InjectionToken<string>("Authentication Log Out Endpoint");
export const AUTH_REFRESH_TOKEN_ENDPOINT = new InjectionToken<string>("Authentication Refresh Token Endpoint");
export const AUTH_SIGN_UP_ENDPOINT = new InjectionToken<string>("Authentication Sign Up Endpoint");
export const AUTH_USER_PROFILE_ENDPOINT = new InjectionToken<string>("Authentication User Profile Fetch Endpoint");
export const LOG_IN_ROUTE = new InjectionToken<string>("Log In Route");
export const SIGN_UP_ROUTE = new InjectionToken<string>("Sign Up Route");
export const USER_DASHBOARD_ROUTE = new InjectionToken<string>("User Dashboard Route");
