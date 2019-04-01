import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { combineLatest, EMPTY } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";

import { ApiResponse, } from "../../../core/interfaces/api-response";
import { DialogService } from "../../../ui/services/dialog.service";
import { LoadingService } from "../../../ui/services/loading.service";

import { EMAIL_VERIFICATION_ROUTE, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { EmailVerificationService } from "../../services/email-verification.service";

@Component({
  selector: "sprk-email-verifier",
  templateUrl: "./email-verifier.component.html"
})
export class EmailVerifierComponent implements OnInit {

  public checkingEmail = true;
  public emailVerified = false;

  constructor(
    @Inject(USER_DASHBOARD_ROUTE) private userDashboardRoute,
    @Inject(EMAIL_VERIFICATION_ROUTE) private verificationResendRoute,
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
        map(params => Object.assign({ }, ...params)),
        mergeMap((params: { id: number, expires: number,  signature: string }) => {
          const { id, ...verifyData } = params;

          if (!id || !verifyData) {
            this.checkingEmail = false;
            return EMPTY;
          }

          this.loading.show();

          return this.emailVerifier.verify(id, verifyData as any);
        }),
        catchError((response: HttpErrorResponse) => {
          this.loading.hide();

          if (response.status === 403) {
            this.dialog.error(response.error.message)
              .then(() => {
                this.checkingEmail = false;

                this.router.navigateByUrl(this.verificationResendRoute);
              });

            return EMPTY;
          }
        })
      )
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
            .then(() => this.router.navigate(["/", "accounts", "dashboard"]));
        }
      });
  }

}
