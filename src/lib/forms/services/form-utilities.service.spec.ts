import { Component } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyFieldConfig, FormlyFieldConfigCache, FormlyFormOptions } from "@ngx-formly/core/lib/components/formly.field.config";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import cloneDeep from "lodash/cloneDeep";

import { FakeTranslateLoader, translationsStub } from "projects/ngx-sparkler/src/testing/fakes";

import { FormUtilitiesService } from "./form-utilities.service";

@Component({
  template: `<form [formGroup]="form">
    <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form"></formly-form>
    <button type="submit" class="btn btn-primary submit-button">Submit</button>
  </form>`
})
class TestComponent {
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[];
  public model: any = {};
  public options: FormlyFormOptions = {};
}

describe("FormUtilitiesService", () => {
  const fieldsConfig: FormlyFieldConfigCache[] = [
    {
      key: "fullName",
      templateOptions: { label: "testForm.fullName" },
      fieldGroup: [
        {
          key: "firstName",
          type: "input",
          defaultValue: "This is a default value",
          templateOptions: { label: "testForm.firstName" },
        },
        {
          key: "lastName",
          type: "input",
          defaultValue: "This is a default value",
          templateOptions: { label: "testForm.lastName" }
        }
      ]
    },
    {
      key: "email",
      type: "input",
      templateOptions: { label: "testForm.email" }
    }
  ];

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: FormUtilitiesService;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FormlyModule.forRoot(),
        FormlyBootstrapModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ]})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.componentInstance;
    service = TestBed.get(FormUtilitiesService);
    translate = TestBed.get(TranslateService);

    translate.setDefaultLang("en");
    translate.use("en");

    component.fields = cloneDeep(fieldsConfig);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("translateLabels", () => {
    it("should translate field label", () => {
      service.translateLabels(component.fields, "testForm");

      expect(component.fields).not.toBe(fieldsConfig);
      expect(component.fields[0].templateOptions.label).toBe(translationsStub.testForm.fullName);
      expect(component.fields[0].fieldGroup[0].templateOptions.label).toBe(translationsStub.testForm.firstName);
      expect(component.fields[0].fieldGroup[1].templateOptions.label).toBe(translationsStub.testForm.lastName);
      expect(component.fields[1].templateOptions.label).toBe(translationsStub.testForm.email);

      const fieldStub: FormlyFieldConfig[] = [{ key: "number" }];

      service.translateLabels(fieldStub, "testForm");

      expect(fieldStub[0].templateOptions).toBeUndefined();
    });
  });

  it("should show validation errors", () => {
    const errors = [
      { field: "firstName", message: "This field is required." },
      { field: "petName", message: "This field was deprecated." },
      { field: "email", message: ["This field is required.", "Please, insert a valid email."]}
    ];

    service.showValidationErrors(component.fields, errors);

    expect(component.fields[0].fieldGroup[1].formControl.errors).not.toBeTruthy();
    expect(component.fields[0].fieldGroup[0].formControl.errors.backend).toBeTruthy();
    expect(component.fields[0].fieldGroup[0].formControl.errors.backend.message).toBe(errors[0].message);
    expect(component.fields[1].formControl.errors).toBeTruthy();
    expect(component.fields[1].formControl.errors.backend.message).toBe(errors[2].message);
  });
});
