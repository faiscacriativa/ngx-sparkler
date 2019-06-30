import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";

import { API_URL, HttpService } from "../../core";
import { EMAIL_VERIFICATION_ENDPOINT, EMAIL_VERIFICATION_RESEND_ENDPOINT, SPARKLER_AUTH_DEFAULTS } from "../injection-tokens";

import { EmailVerificationService } from "./email-verification.service";

describe("EmailVerificationService", () => {
  let httpService: HttpService;
  let service: EmailVerificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: API_URL, useValue: "http://localhost:8000" }
      ]
    });
  }));

  beforeEach(() => {
    httpService               = TestBed.get(HttpService);
    service                   = TestBed.get(EmailVerificationService);
  });

  describe("verify", () => {
    it ("should call verification endpoint", () => {
      const emailVerificationEndpoint = TestBed.get(EMAIL_VERIFICATION_ENDPOINT);
      const userId           = 1;
      const verificationData = { token: "53an6m7vo23i45u1w34e2n61ug7h56i35acds" };

      spyOn(httpService, "get");

      service.verify(userId, verificationData);

      expect(httpService.get).toHaveBeenCalledWith(`${emailVerificationEndpoint}/${userId}`, verificationData);
    });
  });

  describe("resend", () => {
    it ("should call resend endpoint", () => {
      const emailVerificationResendEndpoint = TestBed.get(EMAIL_VERIFICATION_RESEND_ENDPOINT);

      spyOn(httpService, "get");

      service.resend();

      expect(httpService.get).toHaveBeenCalledWith(emailVerificationResendEndpoint);
    });
  });
});
