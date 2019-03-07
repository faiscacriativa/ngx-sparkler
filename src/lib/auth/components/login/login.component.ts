import { Component, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
// import { TranslateService } from "@ngx-translate/core";

import { FormUtilitiesService } from "../../../forms/services/form-utilities.service";

// import { DialogService } from "../../../ui/services/dialog.service";
import { LoadingService } from "../../../ui/services/loading.service";

import { FormConfig } from "./form.config";
import { USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: "sprk-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent {

  public form = new FormGroup({});
  public fields = FormConfig();
  public model = { };

  constructor(
    private auth: AuthenticationService,
  //   private dialog: DialogService,
    private formUtils: FormUtilitiesService,
    private loading: LoadingService,
    private router: Router,
  //   private translate: TranslateService,
    @Inject(USER_DASHBOARD_ROUTE) private userDashboardRoute: string
  ) {
    this.formUtils.translateLabels(this.fields, "account.login.labels");
  //   // console.log(auth.redirectTo);
  }

  public login(event: Event) {
    event.preventDefault();

    this.loading.show();

    this.auth.login(this.model)
      .subscribe(() => {
        this.router.navigateByUrl(this.userDashboardRoute)
          .then(() => this.loading.hide());
      });

    return false;
  }

  public loginWithFb(event: Event) {
    event.preventDefault();
    return false;
  }

}
