import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { FakeAuthenticationService, FakePromise, FakeRouter } from "projects/ngx-sparkler/src/testing/fakes";

import { SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services";

import { NonAuthenticatedGuard } from "./non-authenticated.guard";

describe("NonAuthenticatedGuard", () => {
  let authentication: AuthenticationService;
  let guard: NonAuthenticatedGuard;
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
    guard          = TestBed.get(NonAuthenticatedGuard);
    router         = TestBed.get(Router);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  describe("canActivate", () => {
    it("should return true", (done: DoneFn) => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isAuthenticated.next(false);

      guard.canActivate().subscribe((result: boolean) => {
        expect(result).toBe(true);
        expect(router.parseUrl).not.toHaveBeenCalled();
        done();
      });
    });

    it("should return the dashboard page route", (done: DoneFn) => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isAuthenticated.next(true);

      guard.canActivate().subscribe((result: boolean) => {
        expect(result).toBe(TestBed.get(USER_DASHBOARD_ROUTE));
        expect(router.parseUrl).toHaveBeenCalled();
        done();
      });
    });
  });

  describe("canActivateChild", () => {
    it("should return true", (done: DoneFn) => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isAuthenticated.next(false);

      guard.canActivateChild().subscribe((result: boolean) => {
        expect(result).toBe(true);
        expect(router.parseUrl).not.toHaveBeenCalled();
        done();
      });
    });

    it("should return the dashboard page route", (done: DoneFn) => {
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isAuthenticated.next(true);

      guard.canActivateChild().subscribe((result: boolean) => {
        expect(result).toBe(TestBed.get(USER_DASHBOARD_ROUTE));
        expect(router.parseUrl).toHaveBeenCalled();
        done();
      });
    });
  });

  describe("canLoad", () => {
    it("should return true", (done: DoneFn) => {
      spyOn(router, "navigateByUrl").and.returnValue(FakePromise);
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isAuthenticated.next(false);

      guard.canLoad().subscribe((result: boolean) => {
        expect(result).toBe(true);

        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(router.parseUrl).not.toHaveBeenCalled();

        done();
      });
    });

    it("should redirect to login page and return false", (done: DoneFn) => {
      spyOn(router, "navigateByUrl").and.returnValue(FakePromise);
      spyOn(router, "parseUrl").and.callThrough();

      authentication.isAuthenticated.next(true);

      guard.canLoad().subscribe((result: boolean) => {
        expect(result).toBe(false);

        expect(router.navigateByUrl).toHaveBeenCalled();
        expect(router.parseUrl).toHaveBeenCalled();

        done();
      });
    });
  });
});
