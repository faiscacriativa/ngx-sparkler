import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";

import { API_URL, HttpService } from "../../core";
import {
  PASSWORD_CHANGE_ENDPOINT,
  PASSWORD_RESET_ENDPOINT,
  PASSWORD_RESET_REQUEST_ENDPOINT,
  SPARKLER_AUTH_DEFAULTS
} from "../injection-tokens";

import { PasswordService } from "./password.service";

describe("PasswordService", () => {
  let httpService: HttpService;
  let service: PasswordService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: API_URL, useValue: "http://localhost:8000" }
      ]
    });
  }));

  beforeAll(() => {
    httpService = TestBed.get(HttpService);
    service     = TestBed.get(PasswordService);
  });

  describe("change", () => {
    it ("should call password change endpoint", () => {
      const changeEndpoint = TestBed.get(PASSWORD_CHANGE_ENDPOINT);
      const requestData    = {
        old_password: "My-Old-Password",
        password: "Its a secret!",
        password_confirm: "Its a secret!"
      };

      spyOn(httpService, "post");

      service.change(requestData);

      expect(httpService.post).toHaveBeenCalledWith(changeEndpoint, requestData);
    });
  });

  describe("request", () => {
    it ("should call password reset request endpoint", () => {
      const resetRequestEndpoint = TestBed.get(PASSWORD_RESET_REQUEST_ENDPOINT);
      const userEmail            = "user@provider";

      spyOn(httpService, "post");

      service.request(userEmail);

      expect(httpService.post).toHaveBeenCalledWith(resetRequestEndpoint, { email: userEmail });
    });
  });

  describe("reset", () => {
    it ("should call password reset endpoint", () => {
      const resetEndpoint = TestBed.get(PASSWORD_RESET_ENDPOINT);
      const requestData    = {
        token: "aoo14bnw32m4pom5asod3h7fjwe26rd35s",
        password: "Its a secret!",
        password_confirm: "Its a secret!"
      };

      spyOn(httpService, "post");

      service.reset(requestData);

      expect(httpService.post).toHaveBeenCalledWith(resetEndpoint, requestData);
    });
  });
});
