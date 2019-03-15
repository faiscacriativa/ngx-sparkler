import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class UserVerifiedGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private auth: AuthenticationService, protected router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.userHasEmailVerified()) {
      return this.router.parseUrl("/email/verify");
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
    return this.userHasEmailVerified();
  }

  protected userHasEmailVerified(): boolean {
    return this.auth.isVerified.value;
  }

}
