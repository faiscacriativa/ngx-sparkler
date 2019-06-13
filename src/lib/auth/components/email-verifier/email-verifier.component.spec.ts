import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/mocks/fake-translate-loader";

import { API_URL } from "../../../core";
import { DialogService, LoadingService, SPARKLER_UI_DEFAULTS } from "../../../ui";
import { EMAIL_VERIFICATION_ROUTE, SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { EmailVerificationService } from "../../services";

import { EmailVerifierComponent } from "./email-verifier.component";

describe("EmailVerifierComponent", () => {
  let component: EmailVerifierComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<EmailVerifierComponent>;

  let dialog: DialogService;
  let loading: LoadingService;
  let router: Router;
  let userDashboardRoute: string;
  let verificationResendRoute: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailVerifierComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        SPARKLER_UI_DEFAULTS,
        EmailVerificationService,
        { provide: API_URL, useValue: "https://localhost:8000" }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(EmailVerifierComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    dialog  = element.injector.get(DialogService);
    loading = element.injector.get(LoadingService);
    router  = element.injector.get(Router);

    userDashboardRoute      = element.injector.get(USER_DASHBOARD_ROUTE);
    verificationResendRoute = element.injector.get(EMAIL_VERIFICATION_ROUTE);

    spyOn(dialog, "error").and.callThrough();
    spyOn(dialog, "success").and.callThrough();
    spyOn(dialog, "warning").and.callThrough();

    spyOn(loading, "hide");
    spyOn(loading, "show");

    spyOn(router, "navigateByUrl");
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should show resend verification link button", () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    spyOn(emailVerification, "verify");

    fixture.detectChanges();

    const button = element.query(By.css("button.btn-primary"));

    expect(button).toBeTruthy();
    expect(component.checkingEmail).toBe(false);
    expect(emailVerification.verify).not.toHaveBeenCalled();
    expect(loading.show).not.toHaveBeenCalled();
    expect(loading.hide).not.toHaveBeenCalled();
    expect(dialog.error).not.toHaveBeenCalled();
    expect(dialog.success).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should fail to verify unauthenticated users", async () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    const route             = element.injector.get(ActivatedRoute);

    const errorMessage = "Forbidden.";
    const params = { id: 1, expires: 3600, signature: "fakesignature" };
    const { id, ...verifyData } = params;

    spyOn(route, "params").and.callFake(() => { });
    spyOn(route, "queryParams").and.callFake(() => params);
    spyOn(emailVerification, "verify")
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 403
      })));

    fixture.detectChanges();

    await (document.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.checkingEmail).toBe(false);
    expect(emailVerification.verify).toHaveBeenCalledWith(id, verifyData);
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).toHaveBeenCalledWith(errorMessage);
    expect(dialog.success).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(verificationResendRoute);
  });

  it("should fail to verify because the backend returned an error", () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    const route             = element.injector.get(ActivatedRoute);

    const errorMessage = "Something is invalid.";
    const params = { id: 2, expires: 7200, signature: "signature" };
    const { id, ...verifyData } = params;

    spyOn(route, "params").and.callFake(() => { });
    spyOn(route, "queryParams").and.callFake(() => params);
    spyOn(emailVerification, "verify")
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 422
      })));

    fixture.detectChanges();

    expect(component.checkingEmail).toBe(false);
    expect(emailVerification.verify).toHaveBeenCalledWith(id, verifyData);
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).not.toHaveBeenCalledWith(errorMessage);
    expect(dialog.success).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should verify the email", async () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    const route             = element.injector.get(ActivatedRoute);

    const successMessage = "Email verified successfully!";
    const params = { id: 3, expires: 10800, signature: "validsignature" };
    const { id, ...verifyData } = params;

    spyOn(route, "params").and.callFake(() => { });
    spyOn(route, "queryParams").and.callFake(() => params);
    spyOn(emailVerification, "verify")
      .and.callFake(() => of({ message: successMessage }));

    fixture.detectChanges();

    await (document.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.checkingEmail).toBe(true);
    expect(emailVerification.verify).toHaveBeenCalledWith(id, verifyData);
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).not.toHaveBeenCalled();
    expect(dialog.success).toHaveBeenCalledWith(successMessage);
    expect(router.navigateByUrl).toHaveBeenCalledWith(userDashboardRoute);
  });

  it("should resend email verification link", async () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    const successMessage = "Email verification link sent.";

    spyOn(emailVerification, "resend")
      .and.callFake(() => of({ message: successMessage }));
    spyOn(emailVerification, "verify");

    fixture.detectChanges();

    element.query(By.css("button.btn-primary"))
      .triggerEventHandler("click", { preventDefault: () => { } });

    await (document.body.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.checkingEmail).toBe(false);
    expect(emailVerification.verify).not.toHaveBeenCalled();
    expect(emailVerification.resend).toHaveBeenCalled();
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).not.toHaveBeenCalled();
    expect(dialog.success).toHaveBeenCalledWith(successMessage);
    expect(dialog.warning).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(userDashboardRoute);
  });

  it("should show a warning message when trying to resend the verification link", async () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    const errorMessage = "Already verified.";

    spyOn(emailVerification, "resend")
      .and.callFake(() => of({
        error: true,
        message: errorMessage
      }));
    spyOn(emailVerification, "verify");

    fixture.detectChanges();

    element.query(By.css("button.btn-primary"))
      .triggerEventHandler("click", { preventDefault: () => { } });

    await (document.body.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.checkingEmail).toBe(false);
    expect(emailVerification.verify).not.toHaveBeenCalled();
    expect(emailVerification.resend).toHaveBeenCalled();
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).not.toHaveBeenCalled();
    expect(dialog.success).not.toHaveBeenCalled();
    expect(dialog.warning).toHaveBeenCalledWith(errorMessage);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should fail to resend the verification link", async () => {
    const emailVerification = element.injector.get(EmailVerificationService);
    const errorMessage = "email.verify.resend.failed";

    spyOn(emailVerification, "resend")
      .and.callFake(() => throwError(new HttpErrorResponse({ status: 500 })));
    spyOn(emailVerification, "verify");

    fixture.detectChanges();

    element.query(By.css("button.btn-primary"))
      .triggerEventHandler("click", { preventDefault: () => { } });

    await (document.body.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.checkingEmail).toBe(false);
    expect(emailVerification.verify).not.toHaveBeenCalled();
    expect(emailVerification.resend).toHaveBeenCalled();
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).toHaveBeenCalledWith(errorMessage);
    expect(dialog.success).not.toHaveBeenCalled();
    expect(dialog.warning).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
