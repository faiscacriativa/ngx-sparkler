import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";

import { ApiResponse } from "../../../core/interfaces/index";
import { FormUtilitiesService } from "../../../forms/services/index";
import { DialogService, LoadingService } from "../../../ui/services/index";

import { PASSWORD_RESET_REQUEST_ROUTE, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { PasswordService } from "../../services/index";

import { RequestFormConfig, ResetFormConfig } from "./form.config";

@Component({
  selector: "sprk-password-reset",
  templateUrl: "./password-reset.component.html"
})
export class PasswordResetComponent implements OnInit {

  public form = new FormGroup({ });
  public fields: FormlyFieldConfig[];
  public model: any = { };

  public hasToken = false;

  constructor(
    @Inject(USER_DASHBOARD_ROUTE) private dashboardRoute: string,
    @Inject(PASSWORD_RESET_REQUEST_ROUTE) private requestRoute: string,
    private dialog: DialogService,
    private formUtils: FormUtilitiesService,
    private loading: LoadingService,
    private password: PasswordService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const token = params.get("token");

        if (token) {
          this.hasToken = true;
          this.model = { token };
          this.fields = ResetFormConfig(this.translate);
          this.formUtils.translateLabels(this.fields, "password.reset.labels");

          return;
        }

        this.fields = RequestFormConfig();
        this.formUtils.translateLabels(this.fields, "password.request.labels");
      }
    );
  }

  public submit(event: Event): boolean {
    event.preventDefault();

    this.loading.show();

    if (this.hasToken) {
      this.resetPassword();
      return false;
    }

    this.sendRequestLink();

    return false;
  }

  protected sendRequestLink() {
    this.password.request(this.model.email)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          this.loading.hide();

          if (response.status >= 500) {
            this.dialog.error(response.error.message);
          }

          if (response.error.data) {
            this.formUtils.showValidationErrors(this.fields, response.error.data);
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
  }

  protected resetPassword() {
    const { password, password_confirmation } = this.model.password;

    this.password.reset(Object.assign({ }, this.model, { password, password_confirmation }))
      .pipe(
        catchError((response: HttpErrorResponse) => {
          this.loading.hide();

          if (response.error.data === "invalid_token") {
            this.dialog.error(response.error.message)
              .then(() => this.router.navigateByUrl(this.requestRoute));
          } else if (response.error.data) {
            this.formUtils.showValidationErrors(this.fields, response.error.data);
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
  }

}
