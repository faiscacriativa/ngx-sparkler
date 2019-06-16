import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { API_URL } from "../../../core";
import { FormUtilitiesService } from "../../../forms";
import { DialogService, LoadingService, SPARKLER_UI_DEFAULTS } from "../../../ui";
import { SPARKLER_AUTH_DEFAULTS, USER_DASHBOARD_ROUTE } from "../../injection-tokens";
import { PasswordService } from "../../services";

import { ChangePasswordComponent } from "./change-password.component";

describe("ChangePasswordComponent", () => {
  let component: ChangePasswordComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  let dialog: DialogService;
  let formUtils: FormUtilitiesService;
  let loading: LoadingService;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        FormlyBootstrapModule,
        FormlyModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        SPARKLER_UI_DEFAULTS,
        PasswordService,
        { provide: API_URL, useValue: "https://localhost:8000" }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    component.model = data;

    fixture.detectChanges();

    dialog    = element.injector.get(DialogService);
    formUtils = element.injector.get(FormUtilitiesService);
    loading   = element.injector.get(LoadingService);

    spyOn(component, "submit").and.callThrough();

    spyOn(dialog, "error").and.callThrough();
    spyOn(dialog, "success").and.callThrough();

    spyOn(formUtils, "showValidationErrors").and.callThrough();

    spyOn(loading, "show").and.callFake(() => { });
    spyOn(loading, "hide").and.callFake(() => { });
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should show success message", async () => {
    const dashboardRoute = element.injector.get(USER_DASHBOARD_ROUTE);
    const responseMessage = "Password changed successfully!";

    const password = element.injector.get(PasswordService);
    spyOn(password, "change").and.callFake(() => of({ message: responseMessage }));

    const router = element.injector.get(Router);
    spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve());

    element.query(By.css("form"))
      .triggerEventHandler("submit", { preventDefault: () => { } });

    await (document.body.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.submit).toHaveBeenCalled();
    expect(password.change).toHaveBeenCalledWith(requestPayload);

    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();

    expect(dialog.error).not.toHaveBeenCalled();
    expect(dialog.success).toHaveBeenCalledWith(responseMessage);
    expect(formUtils.showValidationErrors).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(dashboardRoute);
  });

  it("should show validation errors", () => {
    const password = element.injector.get(PasswordService);
    spyOn(password, "change").and.callFake(() => throwError(
      new HttpErrorResponse({
        error: {
          data: [
            { field: "current_password", message: "Current password is invalid." }
          ]
        },
        status: 422
      })
    ));

    element.query(By.css("form"))
      .triggerEventHandler("submit", { preventDefault: () => { } });

    expect(component.submit).toHaveBeenCalled();
    expect(password.change).toHaveBeenCalledWith(requestPayload);

    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();

    expect(dialog.error).not.toHaveBeenCalled();
    expect(dialog.success).not.toHaveBeenCalled();

    expect(formUtils.showValidationErrors).toHaveBeenCalled();
  });

  it("should show error message", async () => {
    const password = element.injector.get(PasswordService);
    spyOn(password, "change").and.callFake(() => throwError(
      new HttpErrorResponse({
        error: { message: "Unknown error." },
        status: 500
      })
    ));

    element.query(By.css("form"))
      .triggerEventHandler("submit", { preventDefault: () => { } });

    await (document.body.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.submit).toHaveBeenCalled();
    expect(password.change).toHaveBeenCalledWith(requestPayload);

    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();

    expect(dialog.error).toHaveBeenCalled();
    expect(dialog.success).not.toHaveBeenCalled();

    expect(formUtils.showValidationErrors).not.toHaveBeenCalled();
  });
});
