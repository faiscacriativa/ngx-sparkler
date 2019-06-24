import { Inject, Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  UrlTree
} from "@angular/router";

import { EMAIL_VERIFICATION_ROUTE } from "../injection-tokens";
import { AuthenticationService } from "../services/index";

@Injectable({
  providedIn: "root"
})
export class UserVerifiedGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    @Inject(EMAIL_VERIFICATION_ROUTE) protected emailVerifyRoute: string,
    protected auth: AuthenticationService,
    protected router: Router
  ) {

  }

  canActivate(): boolean | UrlTree {
    if (!this.userHasEmailVerified()) {
      return this.router.parseUrl(this.emailVerifyRoute);
    }

    return true;
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

  canLoad(): boolean {
    return this.userHasEmailVerified();
  }

  protected userHasEmailVerified(): boolean {
    return this.auth.isVerified.value;
  }

}
