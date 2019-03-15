import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { empty } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "../../services/authentication.service";
import { FormUtilitiesService } from "../../../forms/services/form-utilities.service";
import { DialogService } from "../../../ui/services/dialog.service";
import { LoadingService } from "../../../ui/services/loading.service";

import { FormConfig } from "./form.config";

@Component({
  selector: "sprk-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent {

  public form = new FormGroup({ });
  public fields = FormConfig();
  public model = { };

  constructor(
    private auth: AuthenticationService,
    private dialog: DialogService,
    private formUtils: FormUtilitiesService,
    private loading: LoadingService,
    private translate: TranslateService
  ) {
    this.formUtils.translateLabels(this.fields, "accounts.login.labels");
  }

  public login(event: Event) {
    event.preventDefault();

    this.loading.show();

    this.auth.login(this.model)
      .pipe(
        catchError(() => {
          this.dialog.error(this.translate.instant("accounts.login.failed"));
          this.loading.hide();

          return empty();
        }))
      .subscribe(() => {
        this.auth.redirect()
          .then(() => this.loading.hide());
      });

    return false;
  }

}
