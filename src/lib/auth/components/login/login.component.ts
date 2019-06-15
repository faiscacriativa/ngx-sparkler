import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";

import { FormUtilitiesService } from "../../../forms/services/index";
import { DialogService, LoadingService } from "../../../ui/services/index";
import { AuthenticationService } from "../../services/index";

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
        catchError((response: HttpErrorResponse) => {
          let message = this.translate.instant("accounts.login.failed");

          if (response.status === 401) {
            message = response.error.message;
          }

          this.dialog.error(message);
          this.loading.hide();

          return EMPTY;
        }))
      .subscribe(() => {
        this.auth.redirect()
          .then(() => this.loading.hide());
      });

    return false;
  }

}
