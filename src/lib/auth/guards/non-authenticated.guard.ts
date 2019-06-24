import { Inject, Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  UrlTree
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { USER_DASHBOARD_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services/index";

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

  canActivate(): Observable<boolean | UrlTree> {
    return this.isAuthenticated()
      .pipe(map((authenticated: boolean) => {
        const redirectTo = this.getRedirect(authenticated);

        return redirectTo ? redirectTo : !authenticated;
      }));
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }

  canLoad(): Observable<boolean> {
    return this.isAuthenticated()
      .pipe(switchMap((authenticated: boolean) => {
        const redirectTo = this.getRedirect(authenticated);

        if (redirectTo) {
          this.router.navigateByUrl(redirectTo);
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
