import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import * as jwt from "jsonwebtoken";
import { of, throwError } from "rxjs";

import {
  FakeLocalStorage,
  FakeRouter,
  FakeTranslateLoader,
  installFakeLocalStorage
} from "projects/ngx-sparkler/src/testing/fakes";

import { API_URL, HttpService } from "../../core";
import {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_LOG_OUT_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  AUTH_SIGN_UP_ENDPOINT,
  AUTH_USER_PROFILE_ENDPOINT,
  SPARKLER_AUTH_DEFAULTS,
  USER_DASHBOARD_ROUTE
} from "../injection-tokens";
import { User } from "../interfaces";

import { AuthenticationService } from "./authentication.service";

describe("AuthenticationService", () => {
  let httpService: HttpService;
  let service: AuthenticationService;

  beforeEach(async(() => {
    installFakeLocalStorage();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        }),
      ],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: API_URL, useValue: "http://localhost:8000/api" },
        { provide: Router, useValue: FakeRouter }
      ]
    });
  }));

  beforeEach(() => {
    httpService = TestBed.get(HttpService);
    service     = TestBed.get(AuthenticationService);
  });

  describe("fetchUser", () => {
    it ("should call the user profile backend", () => {
      const userProfileEndpoint = TestBed.get(AUTH_USER_PROFILE_ENDPOINT);

      const userStub: Partial<User> =  {
        email: "user@provider",
        created_at: "2019-06-29 18:37",
        updated_at: "2019-06-29 18:37",
        email_verified_at: "2019-06-29 18:40"
      };

      spyOn(httpService, "get")
        .and.callFake(() => of({
          data: userStub as User
        }));

      service.fetchUser().subscribe((user: User) => expect(user).toBe(userStub as User));

      expect(httpService.get).toHaveBeenCalledWith(userProfileEndpoint);

      expect(service.isAuthenticated.value).toBe(true);
      expect(service.isVerified.value).toBe(true);
      expect(service.user.value).toBe(userStub as User);
    });

    it ("should set the guest user", () => {
      const guestUser           = { profile: { first_name: "general.guest" } };
      const userProfileEndpoint = TestBed.get(AUTH_USER_PROFILE_ENDPOINT);

      spyOn(httpService, "get")
        .and.callFake(() => throwError({ message: "Unknown Error" }));

      service.fetchUser().subscribe((response: any) => expect(response).toEqual(jasmine.objectContaining(guestUser as User)));

      expect(httpService.get).toHaveBeenCalledWith(userProfileEndpoint);

      expect(service.isAuthenticated.value).toBe(false);
      expect(service.user.value).toEqual(jasmine.objectContaining(guestUser as User));
    });
  });

  describe("login", () => {
    it ("should call the login backend", () => {
      const loginEndpoint       = TestBed.get(AUTH_LOG_IN_ENDPOINT);
      const userProfileEndpoint = TestBed.get(AUTH_USER_PROFILE_ENDPOINT);

      const credentials      = { email: "user@email", password: "shhhh" };
      const refreshTokenStub = "nb3i7on5a2sdo53fh315asad";

      const userStub: Partial<User> =  {
        email: "user@provider",
        created_at: "2019-06-29 18:37",
        updated_at: "2019-06-29 18:37",
        email_verified_at: "2019-06-29 18:40"
      };

      const jwtToken   = jwt.sign({ }, "shhh", { expiresIn: "1h" });
      const jwtDecoded = jwt.decode(jwtToken) as any;

      spyOn(httpService, "get")
        .and.callFake(() => of({
          data: userStub as User
        }));

      spyOn(httpService, "post")
        .and.callFake(() => of({
          data: {
            access_token: jwtToken,
            refresh_token: refreshTokenStub
          }
        }));

      service.login(credentials).subscribe(() => { });

      expect(httpService.post).toHaveBeenCalledWith(loginEndpoint, credentials);
      expect(httpService.get).toHaveBeenCalledWith(userProfileEndpoint);

      expect(localStorage.setItem).toHaveBeenCalledWith("access_token", jwtToken);
      expect(localStorage.setItem).toHaveBeenCalledWith("expires_in", (jwtDecoded.exp * 1000).toString());
      expect(localStorage.setItem).toHaveBeenCalledWith("refresh_token", refreshTokenStub);

      expect(service.accessToken).toBe(jwtToken);
      expect(service.isAuthenticated.value).toBe(true);
      expect(service.isVerified.value).toBe(true);
      expect(service.user.value).toBe(userStub as User);
    });
  });

  describe("logout", () => {
    it ("should clear authentication data", () => {
      spyOnProperty(service, "accessToken", "get").and.returnValue(null);

      service.logout().subscribe((response) => {
        expect(response).toEqual(jasmine.objectContaining({ error: false, message: "Ok" }));
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("expires_in");
      expect(localStorage.removeItem).toHaveBeenCalledWith("refresh_token");
    });

    it ("should logout the user and clear authentication data", () => {
      const logoutEndpoint = TestBed.get(AUTH_LOG_OUT_ENDPOINT);
      const jwtToken = jwt.sign({ jti: "a", refresh_token: "amgo5f2n1z5x2cv4hqe3" }, "secret");

      spyOnProperty(service, "accessToken", "get").and.returnValue(jwtToken);
      spyOn(httpService, "post").and.callFake(() => of({ error: false }));

      service.logout({ extra_data: "asdf" }).subscribe(() => { });

      expect(httpService.post).toHaveBeenCalledWith(logoutEndpoint, { jti: "a", extra_data: "asdf" });

      expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("expires_in");
      expect(localStorage.removeItem).toHaveBeenCalledWith("refresh_token");
    });

    it ("should not clear user data", () => {
      const logoutEndpoint = TestBed.get(AUTH_LOG_OUT_ENDPOINT);
      const jwtToken = jwt.sign({ jti: "b", refresh_token: "1z5amgo5f2nx2cv4hqe3" }, "secret");

      spyOnProperty(service, "accessToken", "get").and.returnValue(jwtToken);
      spyOn(httpService, "post").and.callFake(() => of({ error: true }));

      service.logout().subscribe(() => { });

      expect(httpService.post).toHaveBeenCalledWith(logoutEndpoint, { jti: "b" });

      expect(localStorage.removeItem).not.toHaveBeenCalledWith("access_token");
      expect(localStorage.removeItem).not.toHaveBeenCalledWith("expires_in");
      expect(localStorage.removeItem).not.toHaveBeenCalledWith("refresh_token");
    });
  });

  describe("redirect", () => {
    it ("should redirect user to the dashboard", () => {
      const redirectTarget = TestBed.get(USER_DASHBOARD_ROUTE);
      const router = TestBed.get(Router);

      spyOn(router, "navigateByUrl");

      service.redirect();

      expect(router.navigateByUrl).toHaveBeenCalledWith(redirectTarget);
      expect(router.redirectTo).toBeUndefined();
    });

    it ("should redirect to a specific route", () => {
      const redirectTarget = "/login?usr=aassda";
      const router         = TestBed.get(Router);

      spyOn(router, "navigateByUrl");

      service.redirectTo = redirectTarget;
      service.redirect();

      expect(router.navigateByUrl).toHaveBeenCalledWith(redirectTarget);
      expect(router.redirectTo).toBeUndefined();
    });

    it ("should redirect to a specific URL", () => {
      const redirectTarget = "http://google.com";
      const router         = TestBed.get(Router);

      spyOn(router, "navigateByUrl");

      service.redirectTo = redirectTarget;
      service.redirect();

      expect(router.navigateByUrl).toHaveBeenCalledWith(redirectTarget);
      expect(router.redirectTo).toBeUndefined();
    });
  });

  describe("refreshAccessToken", () => {
    it ("should refresh the access token", () => {
      const refreshTokenStub = "jvjg904fafbnlk53job02abys6f879892g8fishjvas";
      const jwtToken         = jwt.sign({ refresh_token: refreshTokenStub }, "secret", { expiresIn: "1h" });
      const jwtDecoded: any  = jwt.decode(jwtToken, { complete: true });

      const postResponse = {
        access_token: jwtToken,
        refresh_token: refreshTokenStub
      };

      const refreshTokenData     = { refresh_token: refreshTokenStub };
      const refreshTokenEndpoint = TestBed.get(AUTH_REFRESH_TOKEN_ENDPOINT);
      const userProfileEndpoint  = TestBed.get(AUTH_USER_PROFILE_ENDPOINT);

      FakeLocalStorage.store.refresh_token = refreshTokenStub;

      spyOn(httpService, "get")
        .and.callFake(() => of({
          data: {
            email: "user@provider",
            created_at: "2019-06-29 05:59:55",
            updated_at: "2019-06-29 05:59:55"
          } as User
        }));

      spyOn(httpService, "post")
        .and.callFake(() => of({ data: postResponse }));

      service.refreshAccessToken()
        .subscribe((newAccessToken) => {
          expect(newAccessToken).toEqual(jasmine.objectContaining(postResponse));
        });

      expect(httpService.post).toHaveBeenCalledWith(refreshTokenEndpoint, refreshTokenData);
      expect(httpService.get).toHaveBeenCalledWith(userProfileEndpoint);

      expect(localStorage.setItem).toHaveBeenCalledWith("access_token", jwtToken);
      expect(localStorage.setItem).toHaveBeenCalledWith("expires_in", (jwtDecoded.payload.exp * 1000).toString());
      expect(localStorage.setItem).toHaveBeenCalledWith("refresh_token", refreshTokenStub);

      expect(service.accessToken).toBe(jwtToken);
    });
  });

  describe("signup", () => {
    it ("should call backend to sign up the user", () => {
      const signUpEndpoint = TestBed.get(AUTH_SIGN_UP_ENDPOINT);
      const userData: Partial<User>  = { email: "user@provider", password: "my-password" };

      spyOn(httpService, "post");

      service.signup(userData as User);

      expect(httpService.post).toHaveBeenCalledWith(signUpEndpoint, userData);
    });
  });
});
