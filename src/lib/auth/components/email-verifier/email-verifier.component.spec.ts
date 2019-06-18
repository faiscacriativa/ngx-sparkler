import { HttpErrorResponse } from "@angular/common/http";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeEvent, FakePromise, FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { DialogService, LoadingService } from "../../../ui";
import { EMAIL_VERIFICATION_ROUTE, SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { EmailVerificationService } from "../../services";

import { EmailVerifierComponent } from "./email-verifier.component";

describe("EmailVerifierComponent", () => {
  let component: EmailVerifierComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<EmailVerifierComponent>;

  let emailVerificationRoute: string;
  let userDashboardRoute: string;

  let activatedRouteStub: Partial<ActivatedRoute>;
  let dialogServiceStub: Partial<DialogService>;
  let emailVerificationServiceStub: Partial<EmailVerificationService>;
  let loadingServiceStub: Partial<LoadingService>;
  let routerStub: Partial<Router>;

  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let emailVerificationServiceSpy: jasmine.SpyObj<EmailVerificationService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    activatedRouteStub           = { params: of({ }), queryParams: of({ }) };
    dialogServiceStub            = jasmine.createSpyObj("DialogService", ["error", "success", "warning"]);
    emailVerificationServiceStub = jasmine.createSpyObj("EmailVerificationService", ["resend", "verify"]);
    loadingServiceStub           = jasmine.createSpyObj("LoadingService", ["hide", "show"]);
    routerStub                   = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    TestBed.configureTestingModule({
      declarations: [EmailVerifierComponent],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: EmailVerificationService, useValue: emailVerificationServiceStub },
        { provide: LoadingService, useValue: loadingServiceStub },
        { provide: Router, useValue: routerStub }
      ]})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(EmailVerifierComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    emailVerificationRoute = element.injector.get(EMAIL_VERIFICATION_ROUTE);
    userDashboardRoute     = element.injector.get(USER_DASHBOARD_ROUTE);

    activatedRouteSpy = element.injector.get(ActivatedRoute) as any;

    dialogServiceSpy = element.injector.get(DialogService) as any;
    dialogServiceSpy.error.and.returnValue(FakePromise);
    dialogServiceSpy.success.and.returnValue(FakePromise);
    dialogServiceSpy.warning.and.returnValue(FakePromise);

    emailVerificationServiceSpy = element.injector.get(EmailVerificationService) as any;
    loadingServiceSpy           = element.injector.get(LoadingService) as any;
    routerSpy                   = element.injector.get(Router) as any;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should show resend verification link button", () => {
    fixture.detectChanges();

    const button = element.query(By.css("button.btn-primary"));

    expect(component.checkingEmail).toBe(false);

    expect(button).toBeTruthy();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();
    expect(dialogServiceSpy.warning).not.toHaveBeenCalled();

    expect(loadingServiceSpy.hide).not.toHaveBeenCalled();
    expect(loadingServiceSpy.show).not.toHaveBeenCalled();

    expect(emailVerificationServiceSpy.resend).not.toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should fail to verify unauthenticated users", () => {
    const errorMessage = "Forbidden.";
    const params = { id: 1, expires: 3600, signature: "fakesignature" };
    const { id, ...verifyData } = params;

    (activatedRouteSpy as any).queryParams = of(params);
    emailVerificationServiceSpy.verify
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 403
      })));

    fixture.detectChanges();

    expect(component.checkingEmail).toBe(false);

    expect(emailVerificationServiceSpy.resend).not.toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).toHaveBeenCalledWith(id, verifyData);

    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(loadingServiceSpy.show).toHaveBeenCalled();

    expect(dialogServiceSpy.error).toHaveBeenCalledWith(errorMessage);
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();
    expect(dialogServiceSpy.warning).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(emailVerificationRoute);
  });

  it("should fail to verify because the backend returned an error", () => {
    const errorMessage = "Something is invalid.";
    const params = { id: 2, expires: 7200, signature: "signature" };
    const { id, ...verifyData } = params;

    (activatedRouteSpy as any).queryParams = of(params);
    emailVerificationServiceSpy.verify
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 422
      })));

    fixture.detectChanges();

    expect(component.checkingEmail).toBe(false);

    expect(emailVerificationServiceSpy.resend).not.toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).toHaveBeenCalledWith(id, verifyData);

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();
    expect(dialogServiceSpy.warning).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should verify the email", () => {
    const successMessage = "Email verified successfully!";
    const params = { id: 3, expires: 10800, signature: "validsignature" };
    const { id, ...verifyData } = params;

    (activatedRouteSpy as any).queryParams = of(params);
    emailVerificationServiceSpy.verify
      .and.callFake(() => of({ message: successMessage }));

    fixture.detectChanges();

    expect(component.checkingEmail).toBe(true);

    expect(emailVerificationServiceSpy.resend).not.toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).toHaveBeenCalledWith(id, verifyData);

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).toHaveBeenCalledWith(successMessage);
    expect(dialogServiceSpy.warning).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(userDashboardRoute);
  });

  it("should resend email verification link", () => {
    const successMessage = "Email verification link sent.";

    emailVerificationServiceSpy.resend
      .and.callFake(() => of({ message: successMessage }));

    fixture.detectChanges();

    element.query(By.css("button.btn-primary")).triggerEventHandler("click", FakeEvent);

    expect(component.checkingEmail).toBe(false);

    expect(emailVerificationServiceSpy.resend).toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).not.toHaveBeenCalled();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).toHaveBeenCalledWith(successMessage);
    expect(dialogServiceSpy.warning).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(userDashboardRoute);
  });

  it("should show a warning message when trying to resend the verification link", () => {
    const errorMessage = "Already verified.";

    emailVerificationServiceSpy.resend
      .and.callFake(() => of({
        error: true,
        message: errorMessage
      }));

    fixture.detectChanges();

    element.query(By.css("button.btn-primary")).triggerEventHandler("click", FakeEvent);

    expect(component.checkingEmail).toBe(false);

    expect(emailVerificationServiceSpy.resend).toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).not.toHaveBeenCalled();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();
    expect(dialogServiceSpy.warning).toHaveBeenCalledWith(errorMessage);

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should fail to resend the verification link", () => {
    const errorMessage = "email.verify.resend.failed";

    emailVerificationServiceSpy.resend
      .and.callFake(() => throwError(new HttpErrorResponse({ status: 500 })));

    fixture.detectChanges();

    element.query(By.css("button.btn-primary")).triggerEventHandler("click", FakeEvent);

    expect(component.checkingEmail).toBe(false);

    expect(emailVerificationServiceSpy.resend).toHaveBeenCalled();
    expect(emailVerificationServiceSpy.verify).not.toHaveBeenCalled();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).toHaveBeenCalledWith(errorMessage);
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();
    expect(dialogServiceSpy.warning).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });
});
