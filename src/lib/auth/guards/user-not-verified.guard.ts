import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";

import { UserVerifiedGuard } from "./user-verified.guard";

@Injectable({
  providedIn: "root"
})
export class UserNotVerifiedGuard extends UserVerifiedGuard {

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userHasEmailVerified()) {
      return this.router.parseUrl("/accounts/dashboard");
    }

    return true;
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
    return !this.userHasEmailVerified();
  }

}
