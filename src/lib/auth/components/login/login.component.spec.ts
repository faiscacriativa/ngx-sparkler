import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeEvent, FakePromise, FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { ValidationRulesFactory } from "../../../forms";
import { DialogService, LoadingService } from "../../../ui";
import { SPARKLER_AUTH_DEFAULTS } from "../../injection-tokens";
import { AuthenticationService } from "../../services";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let element: DebugElement;
  let fixture: ComponentFixture<LoginComponent>;

  let authenticationServiceStub: Partial<AuthenticationService>;
  let dialogServiceStub: Partial<DialogService>;
  let loadingServiceStub: Partial<LoadingService>;

  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async(() => {
    authenticationServiceStub = jasmine.createSpyObj("AuthenticationService", ["login", "redirect"]);
    dialogServiceStub         = jasmine.createSpyObj("DialogService", ["error"]);
    loadingServiceStub        = jasmine.createSpyObj("LoadingService", ["hide", "show"]);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        FormlyBootstrapModule,
        FormlyModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        { provide: AuthenticationService, useValue: authenticationServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: LoadingService, useValue: loadingServiceStub }
      ]})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    authenticationServiceSpy = element.injector.get(AuthenticationService) as any;
    dialogServiceSpy         = element.injector.get(DialogService) as any;
    loadingServiceSpy        = element.injector.get(LoadingService) as any;

    const formlyConfig: FormlyConfig  = TestBed.get(FormlyConfig);
    const translate: TranslateService = TestBed.get(TranslateService);

    ValidationRulesFactory(formlyConfig, translate).apply(this);

    spyOn(component, "login").and.callThrough();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should login the user", async () => {
    const params = {
      email: "email@provider.io",
      password: "supaduppasecurepassword"
    };

    authenticationServiceSpy.login
      .and.callFake(() => of(new HttpResponse({ status: 200 })));
    authenticationServiceSpy.redirect.and.returnValue(FakePromise);

    component.model = params;

    fixture.detectChanges();

    element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

    expect(component.login).toHaveBeenCalled();

    expect(authenticationServiceSpy.login).toHaveBeenCalledWith(params);
    expect(authenticationServiceSpy.redirect).toHaveBeenCalled();

    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(loadingServiceSpy.show).toHaveBeenCalled();

    expect(dialogServiceSpy.error).not.toHaveBeenCalled();
  });

  it("should fail to login unauthorized user", async () => {
    const errorMessage = "Unauthorized.";
    const params = {
      email: "user@provider.io",
      password: "mah-wrong-password"
    };

    authenticationServiceSpy.login
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 401
      })));
    authenticationServiceSpy.redirect.and.returnValue(FakePromise);

    component.model = params;

    fixture.detectChanges();

    element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

    expect(component.login).toHaveBeenCalled();

    expect(authenticationServiceSpy.login).toHaveBeenCalledWith(params);
    expect(authenticationServiceSpy.redirect).not.toHaveBeenCalled();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).toHaveBeenCalledWith(errorMessage);
  });

  it("should fail to login user", async () => {
    const errorMessage = "accounts.login.failed";
    const params = {
      email: "admin@provider.io",
      password: "not-that-password"
    };

    authenticationServiceSpy.login
      .and.callFake(() => throwError(new HttpErrorResponse({
        error: { message: errorMessage },
        status: 500
      })));
    authenticationServiceSpy.redirect.and.returnValue(FakePromise);

    component.model = params;

    fixture.detectChanges();

    element.query(By.css("form")).triggerEventHandler("submit", FakeEvent);

    expect(component.login).toHaveBeenCalled();

    expect(authenticationServiceSpy.login).toHaveBeenCalledWith(params);
    expect(authenticationServiceSpy.redirect).not.toHaveBeenCalled();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();

    expect(dialogServiceSpy.error).toHaveBeenCalledWith(errorMessage);
  });
});
