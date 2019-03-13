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
import { from, Observable, of, BehaviorSubject } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";

import { LOG_IN_ROUTE, SIGN_UP_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services/authentication.service";

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

        return authenticated;
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
