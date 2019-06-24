import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";

import { FakeAuthenticationService } from "projects/ngx-sparkler/src/testing/fakes";

import { API_URL } from "../../core";
import { AuthenticationService } from "../services";

import { AccessTokenInterceptor } from "./access-token.interceptor";

describe("AccessTokenInterceptor", () => {
  const apiUrl    = "http://localhost:8000/api";
  const nonApiUrl = "http://localhost:8000";
  const endpoint  = "/protected";

  let authentication: AuthenticationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: API_URL, useValue: apiUrl },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AccessTokenInterceptor,
          multi: true
        },
        { provide: AuthenticationService, useValue: FakeAuthenticationService }
      ]
    });
  }));

  beforeEach(() => {
    authentication        = TestBed.get(AuthenticationService);
    httpClient            = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should not add the authorization header", () => {
    const accessTokenStub = "n456aV78CS34s56Dd4n23N4a77g34GdAhzBZxcvSDaFDM5abm6z4Ap23u24MD6g6pN37h3Zwa3f7R";
    const fullEndpoint    = `${nonApiUrl}${endpoint}`;

    (authentication as any).accessToken = accessTokenStub;

    httpClient.get(fullEndpoint).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpTestingController.expectOne(fullEndpoint);

    expect(httpRequest.request.headers.has("Authorization")).toEqual(false);
    expect(httpRequest.request.headers.get("Authorization")).not.toEqual(`Bearer ${accessTokenStub}`);
  });

  it("should add the authorization header", () => {
    const accessTokenStub = "5abm6z4Ap23u24MD6g6pN37h3Zwa3f7Rn456aV78CS34s56Dd4n23N4aSDfFsGdAhzBZxcvSDaFDM";
    const fullEndpoint    = `${apiUrl}${endpoint}`;

    (authentication as any).accessToken = accessTokenStub;

    httpClient.get(fullEndpoint).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpTestingController.expectOne(fullEndpoint);

    expect(httpRequest.request.headers.has("Authorization")).toEqual(true);
    expect(httpRequest.request.headers.get("Authorization")).toEqual(`Bearer ${accessTokenStub}`);
  });
});
