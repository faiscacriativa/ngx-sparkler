import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { interval, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { FakeAuthenticationService } from "projects/ngx-sparkler/src/testing/fakes";

import { API_URL } from "../../core";
import {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  IGNORE_REDIRECT_FROM,
  SPARKLER_AUTH_DEFAULTS
} from "../injection-tokens";
import { AccessToken } from "../interfaces";
import { AuthenticationService } from "../services";

import { RefreshTokenInterceptor } from "./refresh-token.interceptor";

describe("RefreshTokenInterceptor", () => {
  const apiUrl    = "http://localhost:8000/api";
  const nonApiUrl = "http://localhost:8000";

  let authentication: AuthenticationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: API_URL, useValue: apiUrl },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RefreshTokenInterceptor,
          multi: true
        },
        { provide: IGNORE_REDIRECT_FROM, useValue: ["/api/login"] },
        { provide: AuthenticationService, useValue: FakeAuthenticationService }
      ]
    });
  }));

  beforeEach(() => {
    authentication        = TestBed.get(AuthenticationService);
    httpClient            = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should not refresh token in a non api URL", () => {
    const oldAccessTokenStub = "5abm6z4Ap23u24MD6g6pN37h3Zwa3f7Rn456aV78CS34s56Dd4n23N4aSDfFsGdAhzBZxcvSDaFDM";
    const fullEndpoint       = `${nonApiUrl}/protected`;

    (authentication as any).accessToken = oldAccessTokenStub;

    httpClient.get(fullEndpoint).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const testRequest = httpTestingController.expectOne(fullEndpoint);

    expect(authentication.accessToken).toBe(oldAccessTokenStub);
    expect(testRequest.request.headers.has("Authorization")).toEqual(false);
    expect(testRequest.request.headers.get("Authorization")).not.toEqual(`Bearer ${oldAccessTokenStub}`);
  });

  it("should refresh token", () => {
    const oldAccessTokenStub = "5abm6z4Ap23u24MD6g6pN37h3Zwa3f7Rn456aV78CS34s56Dd4n23N4aSDfFsGdAhzBZxcvSDaFDM";
    const newAccessTokenStub = "n456aV78CS34s56Dd4n23N4a77g34GdAhzBZxcvSDaFDM5abm6z4Ap23u24MD6g6pN37h3Zwa3f7R";
    const fullEndpoint       = `${apiUrl}/protected`;

    (authentication as any).accessToken = oldAccessTokenStub;
    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;

      return of({ access_token: newAccessTokenStub } as AccessToken);
    };

    httpClient.get(fullEndpoint).subscribe(response => expect(response).toBe("Ok."));

    httpTestingController.expectOne(fullEndpoint)
      .error(
        new ErrorEvent("Request Unauthorized"),
        { status: 401, statusText: "Unauthorized." }
      );

    const testRequest = httpTestingController.expectOne(fullEndpoint);
    testRequest.flush("Ok.");

    expect(testRequest.request.headers.has("Authorization")).toBe(true);
    expect(testRequest.request.headers.get("Authorization")).toBe(`Bearer ${newAccessTokenStub}`);
  });

  it("should retry the second request that is waiting the token refresh", (done: DoneFn) => {
    const oldAccessTokenStub = "k90b8j29h9g78gf7f56g879h0gg898hg8f6asdcvabhq23fa";
    const newAccessTokenStub = "7j0n270a789h9297sg9fuasr2ghha8jsds900bc0329fasdf";

    const protectedUrl = `${apiUrl}/protected`;
    const otherUrl     = `${apiUrl}/other`;

    (authentication as any).accessToken = oldAccessTokenStub;
    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;

      return interval(1000).pipe(switchMap(() => of({ access_token: newAccessTokenStub } as AccessToken)));
    };

    httpClient.get(protectedUrl).subscribe(response => expect(response).toBe("Ok."));
    httpTestingController.expectOne(protectedUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    httpClient.get(otherUrl).subscribe(response => expect(response).toBe("Ok."));
    httpTestingController.expectOne(otherUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    expect(authentication.accessToken).toBe(newAccessTokenStub);

    setTimeout(
      () => {
        httpTestingController.expectOne(protectedUrl).flush("Ok.");

        const otherRequest = httpTestingController.expectOne(otherUrl);
        otherRequest.flush("Ok.");

        expect(otherRequest.request.headers.has("Authorization")).toBe(true);
        expect(otherRequest.request.headers.get("Authorization")).toBe(`Bearer ${newAccessTokenStub}`);

        done();
      },
      1000
    );
  });

  it("should set redirect URL when refresh token fail", (done: DoneFn) => {
    const newAccessTokenStub = "vmoa045jg87zvs5ag3179hvfglnzpjatsdfq67943fas";
    const protectedUrl       = `${apiUrl}/protected`;

    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;

      return interval(1000).pipe(switchMap(() => of({ access_token: newAccessTokenStub } as AccessToken)));
    };

    httpClient.get(protectedUrl)
      .subscribe(() => { }, response => expect(response.error).toBeTruthy());

    httpTestingController.expectOne(protectedUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    setTimeout(
      () => {
        httpTestingController.expectOne(protectedUrl)
          .error(
            new ErrorEvent("Internal Server Error."),
            { status: 500, statusText: "Internal Server Error" }
          );

        expect(authentication.redirectTo).toBe(location.pathname);

        done();
      },
      1000
    );
  });

  it("should not set redirect URL when refresh token fail", (done: DoneFn) => {
    const newAccessTokenStub = "vmoa045jg87zvs5ag3179hvfglnzpjatsdfq67943fas";
    const protectedUrl       = `${apiUrl}/login`;

    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;

      return of({ access_token: newAccessTokenStub } as AccessToken);
    };

    httpClient.get(protectedUrl)
      .subscribe(() => { }, response => expect(response.error).toBeTruthy());

    httpTestingController.expectOne(protectedUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    setTimeout(
      () => {
        httpTestingController.expectOne(protectedUrl)
          .error(
            new ErrorEvent("Internal Server Error."),
            { status: 500, statusText: "Internal Server Error" }
          );

        expect(authentication.redirectTo).not.toBe(location.pathname);

        done();
      },
      1000
    );
  });

  it("should not refresh in login api URL", () => {
    const loginUrl           = TestBed.get(AUTH_LOG_IN_ENDPOINT);
    const newAccessTokenStub = "bj94vn023801hfa0h804hft5687y9hubi0y9t87r5df";
    const targetUrl          = `${apiUrl}${loginUrl}`;

    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;
      return of({ access_token: newAccessTokenStub } as AccessToken);
    }

    httpClient.get(targetUrl)
      .subscribe(() => { }, response => expect(response.error).toBeTruthy());

    httpTestingController.expectOne(targetUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    expect(authentication.accessToken).not.toBe(newAccessTokenStub);
  });

  it("should not refresh in token refresh api URL", () => {
    const refreshUrl         = TestBed.get(AUTH_REFRESH_TOKEN_ENDPOINT);
    const newAccessTokenStub = "cvbnm67yu56ty78hiob95rg2ffg89g76o59v7yh9hn";
    const targetUrl          = `${apiUrl}${refreshUrl}`;

    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;
      return of({ access_token: newAccessTokenStub } as AccessToken);
    }

    httpClient.get(targetUrl)
      .subscribe(() => { }, response => expect(response.error).toBeTruthy());

    httpTestingController.expectOne(targetUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    expect(authentication.accessToken).not.toBe(newAccessTokenStub);
  });

  it("should ", () => {
    const newAccessTokenStub = "";
    const endpointUrl        = `${apiUrl}/protected`;

    authentication.refreshAccessToken = () => {
      (authentication as any).accessToken = newAccessTokenStub;
      return of({ access_token: newAccessTokenStub } as AccessToken);
    }

    httpClient.get(endpointUrl)
      .subscribe(() => { }, response => expect(response.error).toBeTruthy());

    httpTestingController.expectOne(endpointUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    httpTestingController.expectOne(endpointUrl)
      .error(
        new ErrorEvent("Unauthorized"),
        { status: 401, statusText: "Unauthorized" }
      );

    expect(authentication.accessToken).toBe(newAccessTokenStub);
  });
});
