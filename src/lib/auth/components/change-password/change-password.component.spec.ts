import { HttpErrorResponse } from "@angular/common/http";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeEvent, FakePromise, FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { FormUtilitiesService } from "../../../forms";
import { DialogService, LoadingService } from "../../../ui";
import { SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { PasswordService } from "../../services";

import { ChangePasswordComponent } from "./change-password.component";

describe("ChangePasswordComponent", () => {
  const data = {
    current_password: "alakazam!",
    password: {
      password: "abracadabra!",
      password_confirmation: "abracadabra!"
    }
  };

  const requestPayload = {
    current_password: data.current_password,
    ...data.password
  };

  let component: ChangePasswordComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  let dialogServiceStub: Partial<DialogService>;
  let formUtilitiesServiceStub: Partial<FormUtilitiesService>;
  let loadingServiceStub: Partial<LoadingService>;
  let passwordServiceStub: Partial<PasswordService>;
  let routerStub: Partial<Router>;

  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let formUtilitiesServiceSpy: jasmine.SpyObj<FormUtilitiesService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let passwordServiceSpy: jasmine.SpyObj<PasswordService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    dialogServiceStub        = jasmine.createSpyObj("DialogService", ["error", "success"]);
    formUtilitiesServiceStub = jasmine.createSpyObj("FormUtilitiesService", ["showValidationErrors", "translateLabels"]);
    loadingServiceStub       = jasmine.createSpyObj("LoadingService", ["hide", "show"]);
    passwordServiceStub      = jasmine.createSpyObj("PasswordService", ["change"]);
    routerStub               = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
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
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: LoadingService, useValue: loadingServiceStub },
        { provide: FormUtilitiesService, useValue: formUtilitiesServiceStub },
        { provide: PasswordService, useValue: passwordServiceStub },
        { provide: Router, useValue: routerStub }
      ]})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    dialogServiceSpy = element.injector.get(DialogService) as any;
    dialogServiceSpy.error.and.returnValue(FakePromise);
    dialogServiceSpy.success.and.returnValue(FakePromise);

    formUtilitiesServiceSpy = element.injector.get(FormUtilitiesService) as any;
    loadingServiceSpy       = element.injector.get(LoadingService) as any;
    passwordServiceSpy      = element.injector.get(PasswordService) as any;
    routerSpy               = element.injector.get(Router) as any;

    spyOn(component, "submit").and.callThrough();

    component.model = data;

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should show success message", () => {
    const dashboardRoute  = element.injector.get(USER_DASHBOARD_ROUTE);
    const responseMessage = "Password changed successfully!";

    passwordServiceSpy.change.and.callFake(() => of({ message: responseMessage }));

    element.query(By.css("form"))
      .triggerEventHandler("submit", FakeEvent);

    expect(component.submit).toHaveBeenCalled();

    expect(passwordServiceSpy.change).toHaveBeenCalledWith(requestPayload);

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).toHaveBeenCalledWith(responseMessage);

    expect(formUtilitiesServiceSpy.showValidationErrors).not.toHaveBeenCalled();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(dashboardRoute);
  });

  it("should show validation errors", () => {
    passwordServiceSpy.change
      .and.callFake(() => throwError(
        new HttpErrorResponse({
          error: { data: [{ field: "current_password", message: "Current password is invalid." }] },
          status: 422
        })
      ));

    element.query(By.css("form"))
      .triggerEventHandler("submit", FakeEvent);

    expect(component.submit).toHaveBeenCalled();

    expect(passwordServiceSpy.change).toHaveBeenCalledWith(requestPayload);

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();

    expect(formUtilitiesServiceSpy.showValidationErrors).toHaveBeenCalled();
  });

  it("should show error message", () => {
    passwordServiceSpy.change
      .and.callFake(() => throwError(
        new HttpErrorResponse({
          error: { message: "Unknown error." },
          status: 500
        })
      ));

    element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

    expect(component.submit).toHaveBeenCalled();

    expect(passwordServiceSpy.change).toHaveBeenCalledWith(requestPayload);

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).toHaveBeenCalled();
    expect(dialogServiceSpy.success).not.toHaveBeenCalled();

    expect(formUtilitiesServiceSpy.showValidationErrors).not.toHaveBeenCalled();
  });
});
