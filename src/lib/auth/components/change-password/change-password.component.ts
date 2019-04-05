import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";

import { ApiResponse } from "../../../core/index";
import { FormUtilitiesService } from "../../../forms/index";
import { DialogService, LoadingService } from "../../../ui/index";

import { USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { PasswordService } from "../../services/index";

import { FormConfig } from "./form.config";

@Component({
  selector: "sprk-change-password",
  templateUrl: "./change-password.component.html"
})
export class ChangePasswordComponent implements OnInit {

  public form = new FormGroup({ });
  public fields: FormlyFieldConfig[];
  public model: any = { };

  constructor(
    @Inject(USER_DASHBOARD_ROUTE) private dashboardRoute: string,
    private dialog: DialogService,
    private formUtils: FormUtilitiesService,
    private loading: LoadingService,
    private password: PasswordService,
    private router: Router,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
    this.fields = FormConfig(this.translate);
    this.formUtils.translateLabels(this.fields, "password.change.fields");
  }

  public submit(event: Event): boolean {
    event.preventDefault();

    this.loading.show();

    const { password, password_confirmation } = this.model.password;
    const data = Object.assign({ }, this.model, { password, password_confirmation });

    this.password.change(data)
      .pipe(catchError((response: HttpErrorResponse) => {
          this.loading.hide();

          switch (response.status) {
          case 422:
            this.formUtils.showValidationErrors(this.fields, response.error.data);
            break;
          default:
            this.dialog.error(response.error.message);
          }

          return EMPTY;
        }))
      .subscribe((response: ApiResponse) => {
        this.loading.hide();
        this.dialog.success(response.message)
          .then(() => {
            this.router.navigateByUrl(this.dashboardRoute);
          });
      });

    return false;
  }

}
