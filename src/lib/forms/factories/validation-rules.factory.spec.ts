import { Component, DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyConfig, FormlyFieldConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { SetComponentsLanguageFactory } from "./set-components-language.factory";
import { ValidationRulesFactory } from "./validation-rules.factory";

let testComponentInputs: {
  fields: FormlyFieldConfig[],
  form: FormGroup,
  model: object
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: "test-form-component",
  template: `<form [formGroup]="form">
    <formly-form [model]="model" [fields]="fields" [form]="form"></formly-form>
    <button type="submit" class="btn btn-primary submit-button">Submit</button>
  </form>`
})
class TestFormComponent {
  fields = testComponentInputs.fields;
  form   = testComponentInputs.form;
  model  = testComponentInputs.model || { };
}

describe("ValidationRulesFactory", () => {
  let fixture: ComponentFixture<TestFormComponent>;
  let debugFormElement: DebugElement;
  let inputDebugElements: DebugElement[];

  let bsLocale: BsLocaleService;
  let formlyConfig: FormlyConfig;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFormComponent],
      imports: [
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyBootstrapModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ]
    });

    bsLocale     = TestBed.get(BsLocaleService);
    formlyConfig = TestBed.get(FormlyConfig);
    translate    = TestBed.get(TranslateService);

    ValidationRulesFactory(formlyConfig, translate).apply(this);
  }));

  describe("should add validation messages", () => {
    it("for email validation", () => {
      expect(formlyConfig.messages.email).toBeTruthy();
      expect(formlyConfig.messages.email).toBe("validation.email");
    });

    it("for required field", () => {
      expect(formlyConfig.messages.required).toBeTruthy();
      expect(formlyConfig.messages.required).toBe("validation.required");
    });

    it("for max length validation", () => {
      const maxLengthError = { actualLength: 10, requiredLength: 5 };

      expect(formlyConfig.messages.maxlength).toBeTruthy();
      expect((formlyConfig.messages.maxlength as any).apply(this, [maxLengthError]))
        .toBe("validation.maxLength");
    });

    it("for min length validation", () => {
      const minLengthError = { actualLength: 5, requiredLength: 10 };

      expect(formlyConfig.messages.minlength).toBeTruthy();
      expect((formlyConfig.messages.minlength as any).apply(this, [minLengthError]))
        .toBe("validation.minLength");
    });

    it("for pattern validation", () => {
      expect(formlyConfig.messages.pattern).toBeTruthy();
      expect(formlyConfig.messages.pattern).toBe("validation.pattern");
    });

    it("for telephone validation", () => {
      expect(formlyConfig.messages.telephone).toBeTruthy();
      expect(formlyConfig.messages.telephone).toBe("validation.telephone");
    });
  });

  describe("date validator", () => {
    beforeEach(() => {
      testComponentInputs = {
        fields: [
          {
            key: "date",
            type: "input",
            validators: { validation: ["date"] }
          }
        ],
        form: new FormGroup({ }),
        model: { }
      };

      fixture = TestBed.createComponent(TestFormComponent);
      fixture.detectChanges();

      debugFormElement   = fixture.debugElement.query(By.css("form")) as DebugElement;
      inputDebugElements = debugFormElement.queryAll(By.css("input")) as DebugElement[];
    });

    it("should validate english date formats", () => {
      translate.use("en");

      inputDebugElements[0].nativeElement.value = "02/31/1989";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(false);

      inputDebugElements[0].nativeElement.value = "12/31/1989";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(true);
    });

    it("should validate brazilian date formats", () => {
      translate.use("pt");
      SetComponentsLanguageFactory(bsLocale, translate).apply(this);

      inputDebugElements[0].nativeElement.value = "31/12/1989";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(true);

      inputDebugElements[0].nativeElement.value = "31/02/1989";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(false);
    });
  });

  describe("email validator", () => {
    beforeEach(() => {
      testComponentInputs = {
        fields: [
          {
            key: "email",
            type: "input",
            validators: { validation: ["email"] }
          }
        ],
        form: new FormGroup({ }),
        model: { }
      };

      fixture = TestBed.createComponent(TestFormComponent);
      fixture.detectChanges();

      debugFormElement   = fixture.debugElement.query(By.css("form")) as DebugElement;
      inputDebugElements = debugFormElement.queryAll(By.css("input")) as DebugElement[];
    });

    it("should validate email", () => {
      inputDebugElements[0].nativeElement.value = "test.@email";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(false);
    });
  });

  describe("telephone validator", () => {
    beforeEach(() => {
      testComponentInputs = {
        fields: [
          {
            key: "telephone",
            type: "input",
            validators: { validation: ["telephone"] }
          }
        ],
        form: new FormGroup({ }),
        model: { }
      };

      fixture = TestBed.createComponent(TestFormComponent);
      fixture.detectChanges();

      debugFormElement   = fixture.debugElement.query(By.css("form")) as DebugElement;
      inputDebugElements = debugFormElement.queryAll(By.css("input")) as DebugElement[];
    });

    it("should validate Brazil telephone format with USA country form", () => {
      inputDebugElements[0].nativeElement.value = "+1 021 9 7474-5832";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(false);
    });

    it("should validate brazilian 8 digit telephone format", () => {
      inputDebugElements[0].nativeElement.value = "7474-5832";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(false);
    });

    it("should validate brazilian 9 digit format with land and country code", () => {
      inputDebugElements[0].nativeElement.value = "+55 021 9 7474-5832";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(true);
    });

    it("should validate USA telephone format with USA country code", () => {
      inputDebugElements[0].nativeElement.value = "+1 541-754-3010";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(true);
    });

    it("should validate USA telephone with Brazil country code format", () => {
      inputDebugElements[0].nativeElement.value = "+55 541-754-3010";
      inputDebugElements[0].nativeElement.dispatchEvent(new Event("input"));

      fixture.detectChanges();

      expect(testComponentInputs.fields[0].formControl.valid).toBe(false);
    });
  });
});
