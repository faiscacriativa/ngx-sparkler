import { Injectable } from "@angular/core";
import { UrlTree } from "@angular/router";

import { UserVerifiedGuard } from "./user-verified.guard";

@Injectable({
  providedIn: "root"
})
export class UserNotVerifiedGuard extends UserVerifiedGuard {

  canActivate(): boolean | UrlTree {
    if (this.userHasEmailVerified()) {
      return this.router.parseUrl("/accounts/dashboard");
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
