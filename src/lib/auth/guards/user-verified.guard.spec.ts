import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { FakeAuthenticationService, FakeRouter } from "projects/ngx-sparkler/src/testing/fakes";

import { EMAIL_VERIFICATION_ROUTE, SPARKLER_AUTH_DEFAULTS } from "../injection-tokens";
import { AuthenticationService } from "../services";

import { UserVerifiedGuard } from "./user-verified.guard";

describe("UserVerifiedGuard", () => {
  let authentication: AuthenticationService;
  let guard: UserVerifiedGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: AuthenticationService, useValue: FakeAuthenticationService },
        { provide: Router, useValue: FakeRouter }
      ]
    });

    authentication = TestBed.get(AuthenticationService);
    guard          = TestBed.get(UserVerifiedGuard);
    router         = TestBed.get(Router);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  describe("canActivate", () => {
    it("should return true", () => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isVerified.next(true);

      const result = guard.canActivate();

      expect(result).toBe(true);
      expect(router.parseUrl).not.toHaveBeenCalled();
    });

    it("should return email verification route", () => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isVerified.next(false);

      const result = guard.canActivate();

      expect(result).toBe(TestBed.get(EMAIL_VERIFICATION_ROUTE));
      expect(router.parseUrl).toHaveBeenCalled();
    });
  });

  describe("canActivateChild", () => {
    it("should return true", () => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isVerified.next(true);

      const result = guard.canActivateChild();

      expect(result).toBe(true);
      expect(router.parseUrl).not.toHaveBeenCalled();
    });

    it("should return email verification route", () => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isVerified.next(false);

      const result = guard.canActivateChild();

      expect(result).toBe(TestBed.get(EMAIL_VERIFICATION_ROUTE));
      expect(router.parseUrl).toHaveBeenCalled();
    });
  });

  describe("canLoad", () => {
    it("should return true", () => {
      authentication.isVerified.next(true);

      expect(guard.canLoad()).toBe(true);
    });
  });
});
