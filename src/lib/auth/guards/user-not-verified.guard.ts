import { Inject, Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";

import { EMAIL_VERIFICATION_ROUTE, USER_DASHBOARD_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services";

import { UserVerifiedGuard } from "./user-verified.guard";

@Injectable({
  providedIn: "root"
})
export class UserNotVerifiedGuard extends UserVerifiedGuard {

  constructor(
    @Inject(USER_DASHBOARD_ROUTE) protected dashboardRoute: string,
    @Inject(EMAIL_VERIFICATION_ROUTE) protected emailVerifyRoute: string,
    protected auth: AuthenticationService,
    protected router: Router
  ) {
    super(emailVerifyRoute, auth, router);
  }

  canActivate(): boolean | UrlTree {
    if (this.userHasEmailVerified()) {
      return this.router.parseUrl(this.dashboardRoute);
    }

    return true;
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  canLoad(): boolean {
    return !this.userHasEmailVerified();
  }

}
