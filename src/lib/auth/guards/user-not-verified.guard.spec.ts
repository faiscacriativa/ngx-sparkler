import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { FakeAuthenticationService, FakeRouter } from "projects/ngx-sparkler/src/testing/fakes";

import { SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services";

import { UserNotVerifiedGuard } from "./user-not-verified.guard";

describe("UserNotVerifiedGuard", () => {
  let authentication: AuthenticationService;
  let guard: UserNotVerifiedGuard;
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
    guard          = TestBed.get(UserNotVerifiedGuard);
    router         = TestBed.get(Router);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  describe("canActivate", () => {
    it("should return user dashboard route", () => {
      spyOn(router, "parseUrl").and.callThrough();

      const dashboardRoute = TestBed.get(USER_DASHBOARD_ROUTE);

      authentication.isVerified.next(true);

      const result = guard.canActivate();

      expect(result).toBe(dashboardRoute);
      expect(router.parseUrl).toHaveBeenCalledWith(dashboardRoute);
    });

    it("should return true", () => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isVerified.next(false);

      const result = guard.canActivate();

      expect(result).toBe(true);
      expect(router.parseUrl).not.toHaveBeenCalled();
    });
  });

  describe("canActivateChild", () => {
    it("should return user dashboard route", () => {
      spyOn(router, "parseUrl").and.callThrough();

      const dashboardRoute = TestBed.get(USER_DASHBOARD_ROUTE);

      authentication.isVerified.next(true);

      const result = guard.canActivateChild();

      expect(result).toBe(dashboardRoute);
      expect(router.parseUrl).toHaveBeenCalledWith(dashboardRoute);
    });

    it("should return true", () => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isVerified.next(false);

      const result = guard.canActivateChild();

      expect(result).toBe(true);
      expect(router.parseUrl).not.toHaveBeenCalled();
    });
  });

  describe("canLoad", () => {
    it("should return true", () => {
      authentication.isVerified.next(false);

      const result = guard.canLoad();

      expect(result).toBe(true);
    });
  });
});
