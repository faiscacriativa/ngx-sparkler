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

import { LOG_IN_ROUTE, SIGN_UP_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services/index";

@Injectable({
  providedIn: "root"
})
export class AuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    @Inject(LOG_IN_ROUTE) private loginRoute: string,
    @Inject(SIGN_UP_ROUTE) private signUpRoute: string,
    private authentication: AuthenticationService,
    private router: Router
  ) {

  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.isAuthenticated()
      .pipe(map((authenticated: boolean) => {
        const redirectTo = this.getRedirect(authenticated);

        return redirectTo ? redirectTo : authenticated;
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

        return of(authenticated);
      }));
  }

  private getRedirect(authenticated: boolean): UrlTree {
    const pathname = location.pathname;

    if (
      !authenticated &&
      (!pathname.includes(this.loginRoute) && !pathname.includes(this.signUpRoute))
    ) {
      this.authentication.redirectTo = location.href;

      return this.router.parseUrl(this.loginRoute);
    }

    return null;
  }

  private isAuthenticated(): Observable<boolean> {
    return of(this.authentication.isAuthenticated.value);
  }

}
