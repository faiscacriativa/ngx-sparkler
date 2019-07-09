import { HttpErrorResponse } from "@angular/common/http";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeEvent, FakePromise, FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { FormUtilitiesService, ValidationRulesFactory } from "../../../forms";
import { DialogService, LoadingService } from "../../../ui";
import { PASSWORD_RESET_REQUEST_ROUTE, SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { PasswordService } from "../../services";

import { PasswordResetComponent } from "./password-reset.component";

describe("PasswordResetComponent", () => {
  let component: PasswordResetComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<PasswordResetComponent>;

  let passwordResetRequestRoute: string;
  let userDashboardRoute: string;

  let activatedRouteStub: Partial<ActivatedRoute>;
  let dialogServiceStub: Partial<DialogService>;
  let formUtilitiesServiceStub: Partial<FormUtilitiesService>;
  let loadingServiceStub: Partial<LoadingService>;
  let passwordServiceStub: Partial<PasswordService>;
  let routerStub: Partial<Router>;

  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let formUtilitiesServiceSpy: jasmine.SpyObj<FormUtilitiesService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let passwordServiceSpy: jasmine.SpyObj<PasswordService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    activatedRouteStub       = jasmine.createSpyObj("ActivatedRoute", ["paramMap"]);
    dialogServiceStub        = jasmine.createSpyObj("DialogService", ["error", "success"]);
    formUtilitiesServiceStub = jasmine.createSpyObj("FormUtilitiesServices", ["showValidationErrors", "translateLabels"]);
    loadingServiceStub       = jasmine.createSpyObj("LoadingService", ["hide", "show"]);
    passwordServiceStub      = jasmine.createSpyObj("PasswordService", ["request", "reset"]);
    routerStub               = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [
        ReactiveFormsModule,
        FormlyBootstrapModule,
        FormlyModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: FormUtilitiesService, useValue: formUtilitiesServiceStub },
        { provide: LoadingService, useValue: loadingServiceStub },
        { provide: PasswordService, useValue: passwordServiceStub },
        { provide: Router, useValue: routerStub }
      ]})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    passwordResetRequestRoute = element.injector.get(PASSWORD_RESET_REQUEST_ROUTE);
    userDashboardRoute        = element.injector.get(USER_DASHBOARD_ROUTE);

    activatedRouteSpy = element.injector.get(ActivatedRoute) as any;

    dialogServiceSpy = element.injector.get(DialogService) as any;
    dialogServiceSpy.error.and.returnValue(FakePromise);
    dialogServiceSpy.success.and.returnValue(FakePromise);

    formUtilitiesServiceSpy = element.injector.get(FormUtilitiesService) as any;
    loadingServiceSpy       = element.injector.get(LoadingService) as any;
    passwordServiceSpy      = element.injector.get(PasswordService) as any;
    routerSpy               = element.injector.get(Router) as any;

    const formlyConfig     = element.injector.get(FormlyConfig);
    const translateService = element.injector.get(TranslateService);

    ValidationRulesFactory(formlyConfig, translateService).apply(this);
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should show the request password reset form", () => {
    (activatedRouteSpy as any).paramMap = of({ get: () => null });

    fixture.detectChanges();

    expect(component.hasToken).toBe(false);

    expect(formUtilitiesServiceSpy.translateLabels).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it("should show the reset password form", () => {
    const token = "apv3jx5c2zhu6e5tn76cbb42";

    (activatedRouteSpy as any).paramMap = of({ get: () => token });

    fixture.detectChanges();

    expect(component.hasToken).toBe(true);
    expect(component.model).toEqual(jasmine.objectContaining({ token }));

    expect(formUtilitiesServiceSpy.translateLabels).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  describe("sendResetLink", () => {
    it("should send the request link", () => {
      const successMessage = "Reset link sent!";

      component.model = { email: "user@provider.io" };

      (activatedRouteSpy as any).paramMap = of({ get: () => null });

      passwordServiceSpy.request.and.callFake(() => of({ message: successMessage }));

      fixture.detectChanges();

      element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

      expect(loadingServiceSpy.hide).toHaveBeenCalled();
      expect(loadingServiceSpy.show).toHaveBeenCalled();

      expect(passwordServiceSpy.request).toHaveBeenCalledWith(component.model.email);

      expect(dialogServiceSpy.error).not.toHaveBeenCalled();
      expect(dialogServiceSpy.success).toHaveBeenCalledWith(successMessage);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(userDashboardRoute);
    });

    it("should fail to send the request link", () => {
      const errorMessage = "Something gone wrong.";

      component.model = { email: "faulty@memory.com" };

      (activatedRouteSpy as any).paramMap = of({ get: () => { } });
      passwordServiceSpy.request
        .and.callFake(() => throwError(new HttpErrorResponse({
          status: 500,
          error: { message: errorMessage }
        })));

      fixture.detectChanges();

      element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

      expect(loadingServiceSpy.hide).toHaveBeenCalled();
      expect(loadingServiceSpy.show).toHaveBeenCalled();

      expect(passwordServiceSpy.request).toHaveBeenCalledWith(component.model.email);

      expect(dialogServiceSpy.error).toHaveBeenCalledWith(errorMessage);
      expect(dialogServiceSpy.success).not.toHaveBeenCalledWith(errorMessage);

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it("should fail to send the request link because backend thinks that the input is invalid", () => {
      component.model = { email: "no@memory.com" };

      (activatedRouteSpy as any).paramMap = of({ get: () => { } });
      passwordServiceSpy.request
        .and.callFake(() => throwError({
          status: 422,
          error: {
            data: [
              { field: "email", message: "Email not found." }
            ]
          }
        }));

      fixture.detectChanges();

      element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();

      expect(passwordServiceSpy.request).toHaveBeenCalledWith(component.model.email);

      expect(dialogServiceSpy.error).not.toHaveBeenCalled();
      expect(dialogServiceSpy.success).not.toHaveBeenCalled();

      expect(formUtilitiesServiceSpy.showValidationErrors).toHaveBeenCalled();

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should reset the password", () => {
      const token          = "m52308asaphg0asdfh3";
      const successMessage = "Password redefined!";
      const formValue      = {
        email: "user@provider.io",
        password: {
          password: "mynewpassword",
          password_confirmation: "mynewpassword"
        },
        token
      };

      (activatedRouteSpy as any).paramMap = of({ get: () => token });
      passwordServiceSpy.reset
        .and.callFake(() => of({ message: successMessage }));

      fixture.detectChanges();

      component.form.patchValue(formValue);

      fixture.detectChanges();

      element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

      expect(component.hasToken).toBe(true);

      expect(passwordServiceSpy.reset).toHaveBeenCalledWith({
        email: formValue.email,
        token: formValue.token,
        ...formValue.password
      });

      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();

      expect(dialogServiceSpy.error).not.toHaveBeenCalled();
      expect(dialogServiceSpy.success).toHaveBeenCalledWith(successMessage);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(userDashboardRoute);
    });

    it("should fail to reset upon a invalid token", () => {
      const token        = "y8qjv97a0nxmh0s452bt";
      const errorMessage = "Invalid token.";
      const formValue    = {
        email: "user@provider.io",
        password: {
          password: "mynewpassword",
          password_confirmation: "mynewpassword"
        },
        token
      };

      (activatedRouteSpy as any).paramMap = of({ get: () => ({ token }) });
      passwordServiceSpy.reset
        .and.callFake(() => throwError(new HttpErrorResponse({
          status: 422,
          error: {
            data: "invalid_token",
            message: errorMessage
          }
        })));

      fixture.detectChanges();

      component.form.patchValue(formValue);

      fixture.detectChanges();

      element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

      expect(passwordServiceSpy.reset).toHaveBeenCalledWith({
          email: formValue.email,
          token: formValue.token,
          ...formValue.password
        });

      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();

      expect(dialogServiceSpy.error).toHaveBeenCalledWith(errorMessage);
      expect(dialogServiceSpy.success).not.toHaveBeenCalled();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(passwordResetRequestRoute);
    });

    it("should fail reset upon a invalid email", () => {
      const token        = "mb9fx7zm0H4fXha0bhq4";
      const errorMessage = "Check the input.";
      const formValue    = {
        email: "not-mine@email.co",
        password: {
          password: "nonono",
          password_confirmation: "nonono"
        },
        token
      };

      (activatedRouteSpy as any).paramMap = of({ get: () => ({ token }) });
      passwordServiceSpy.reset
        .and.callFake(() => throwError(new HttpErrorResponse({
          status: 422,
          error: {
            data: [{ field: "email", message: "E-mail not found." }],
            message: errorMessage
          }
        })));

      fixture.detectChanges();

      component.form.patchValue(formValue);

      fixture.detectChanges();

      element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

      expect(passwordServiceSpy.reset).toHaveBeenCalledWith({
        email: formValue.email,
        token: formValue.token,
        ...formValue.password
      });

      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();

      expect(dialogServiceSpy.error).not.toHaveBeenCalled();
      expect(dialogServiceSpy.success).not.toHaveBeenCalled();

      expect(formUtilitiesServiceSpy.showValidationErrors).toHaveBeenCalled();

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
