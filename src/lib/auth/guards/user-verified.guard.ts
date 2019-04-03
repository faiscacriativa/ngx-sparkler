import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  UrlTree
} from "@angular/router";

import { AuthenticationService } from "../services/index";

@Injectable({
  providedIn: "root"
})
export class UserVerifiedGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private auth: AuthenticationService, protected router: Router) {

  }

  canActivate(): boolean | UrlTree {
    if (!this.userHasEmailVerified()) {
      return this.router.parseUrl("/email/verify");
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
