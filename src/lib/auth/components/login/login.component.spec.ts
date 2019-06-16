import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { of, throwError } from "rxjs";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { API_URL } from "../../../core";
import { ValidationRulesFactory } from "../../../forms";
import {
  DialogService,
  LoadingService,
  SPARKLER_UI_DEFAULTS,
  SparklerUiModule
} from "../../../ui";
import { SPARKLER_AUTH_DEFAULTS } from "../../injection-tokens";
import { AuthenticationService } from "../../services";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<LoginComponent>;

  let dialog: DialogService;
  let loading: LoadingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          LoginComponent
        ],
        imports: [
          HttpClientTestingModule,
          ReactiveFormsModule,
          RouterTestingModule,
          BsDatepickerModule.forRoot(),
          FormlyBootstrapModule,
          FormlyModule.forRoot(),
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
          }),
          SparklerUiModule
        ],
        providers: [
          SPARKLER_AUTH_DEFAULTS,
          SPARKLER_UI_DEFAULTS,
          { provide: API_URL, useValue: "https://localhost:8000" }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    dialog         = element.injector.get(DialogService);
    loading        = element.injector.get(LoadingService);

    spyOn(component, "login").and.callThrough();

    spyOn(dialog, "error").and.callThrough();

    spyOn(loading, "hide").and.callFake(() => { });
    spyOn(loading, "show").and.callFake(() => { });

    const formlyConfig: FormlyConfig  = TestBed.get(FormlyConfig);
    const translate: TranslateService = TestBed.get(TranslateService);

    ValidationRulesFactory(formlyConfig, translate).apply(this);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should login the user", async () => {
    const params = {
      email: "email@provider.io",
      password: "supaduppasecurepassword"
    };

    const authentication = element.injector.get(AuthenticationService);
    spyOn(authentication, "login").and.callFake(() => of(new HttpResponse({ status: 200 })));
    spyOn(authentication, "redirect").and.callFake(() => {
      return { then: (callback: any) => callback.apply(this) };
    });

    component.model = params;
    fixture.detectChanges();

    element.query(By.css("form")).triggerEventHandler("submit", { preventDefault: () => { } });

    expect(component.login).toHaveBeenCalled();
    expect(authentication.login).toHaveBeenCalledWith(params);
    expect(authentication.redirect).toHaveBeenCalled();
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
  });

  it("should fail to login unauthorized user", async () => {
    const errorMessage = "Unauthorized.";
    const params = {
      email: "user@provider.io",
      password: "mah-wrong-password"
    };

    const authentication = element.injector.get(AuthenticationService);
    spyOn(authentication, "login")
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 401
      })));
    spyOn(authentication, "redirect").and.callFake(() => Promise.resolve(true));

    component.model = params;
    fixture.detectChanges();

    element.query(By.css("form")).triggerEventHandler("submit", { preventDefault: () => { } });

    await (document.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.login).toHaveBeenCalled();
    expect(authentication.login).toHaveBeenCalledWith(params);
    expect(authentication.redirect).not.toHaveBeenCalled();
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).toHaveBeenCalledWith(errorMessage);
  });

  it("should fail to login user", async () => {
    const errorMessage = "accounts.login.failed";
    const params = {
      email: "admin@provider.io",
      password: "not-that-password"
    };

    const authentication = element.injector.get(AuthenticationService);
    spyOn(authentication, "login")
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 500
      })));
    spyOn(authentication, "redirect").and.callFake(() => Promise.resolve(true));

    component.model = params;
    fixture.detectChanges();

    element.query(By.css("form")).triggerEventHandler("submit", { preventDefault: () => { } });

    await (document.querySelector("button.swal2-confirm") as HTMLElement).click();

    expect(component.login).toHaveBeenCalled();
    expect(authentication.login).toHaveBeenCalledWith(params);
    expect(authentication.redirect).not.toHaveBeenCalled();
    expect(loading.show).toHaveBeenCalled();
    expect(loading.hide).toHaveBeenCalled();
    expect(dialog.error).toHaveBeenCalledWith(errorMessage);
  });
});
