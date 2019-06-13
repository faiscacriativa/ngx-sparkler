import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { combineLatest, EMPTY } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";

import { ApiResponse } from "../../../core";
import { DialogService, LoadingService } from "../../../ui";
import { EMAIL_VERIFICATION_ROUTE, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { EmailVerificationService } from "../../services";

@Component({
  selector: "sprk-email-verifier",
  templateUrl: "./email-verifier.component.html"
})
export class EmailVerifierComponent implements OnInit {

  public checkingEmail: boolean;

  constructor(
    @Inject(USER_DASHBOARD_ROUTE) private userDashboardRoute: string,
    @Inject(EMAIL_VERIFICATION_ROUTE) private verificationResendRoute: string,
    private dialog: DialogService,
    private emailVerifier: EmailVerificationService,
    private loading: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
    this.checkingEmail = true;

    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        mergeMap((params: any) => {
          const { id, ...verifyData } = Object.assign({ }, ...params);

          if (!id || !verifyData) {
            this.checkingEmail = false;
            return EMPTY;
          }

          this.loading.show();

          return this.emailVerifier.verify(id, verifyData as any);
        }),
        catchError((response: HttpErrorResponse) => {
          this.loading.hide();

          this.checkingEmail = false;

          if (response.status === 403) {
            this.dialog.error(response.error.message)
              .then(() => this.router.navigateByUrl(this.verificationResendRoute));
          }

          return EMPTY;
        }))
      .subscribe((response: ApiResponse) => {
        this.loading.hide();

        this.dialog.success(response.message)
          .then(() => {
            this.router.navigateByUrl(this.userDashboardRoute);
          });
      });
  }

  public resend(event: Event) {
    event.preventDefault();

    this.loading.show();

    // Todo: This resend must comply (more) with REST
    this.emailVerifier.resend()
      .pipe(catchError(() => {
          this.loading.hide();
          this.dialog.error(this.translate.instant("email.verify.resend.failed"));

          return EMPTY;
        }))
      .subscribe((response: ApiResponse) => {
        this.loading.hide();

        if (response.error) {
          this.dialog.warning(response.message);
        } else {
          this.dialog.success(response.message)
            .then(() => this.router.navigateByUrl(this.userDashboardRoute));
        }
      });

    return false;
  }

}
