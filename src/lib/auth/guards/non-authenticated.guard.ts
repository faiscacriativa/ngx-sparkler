import { Inject, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
  Router
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { USER_DASHBOARD_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class NonAuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    @Inject(USER_DASHBOARD_ROUTE) private dashboardRoute: string,
    private authentication: AuthenticationService,
    private router: Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated()
      .pipe(map((authenticated: boolean) => {
        const redirectTo = this.getRedirect(authenticated);

        if (redirectTo) {
          return redirectTo;
        }

        return !authenticated;
      }));
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthenticated()
      .pipe(switchMap((authenticated: boolean) => {
        const redirectTo = this.getRedirect(authenticated);

        if (redirectTo) {
          return this.router.navigateByUrl(redirectTo);
        }

        return of(!authenticated);
      }));
  }

  private getRedirect(authenticated: boolean): UrlTree {
    if (authenticated) {
      return this.router.parseUrl(this.dashboardRoute);
    }

    return null;
  }

  private isAuthenticated(): Observable<boolean> {
    return of(this.authentication.isAuthenticated.value);
  }

}
