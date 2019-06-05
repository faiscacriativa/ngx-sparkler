import { ComponentFactoryResolver, DebugElement, Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyConfig, FormlyModule } from "@ngx-formly/core";

import { FormlyHorizontalComponent } from "./horizontal.component";

describe("FormlyHorizontalComponent", () => {
  let fixture: ComponentFixture<FormlyHorizontalComponent>;
  let component: FormlyHorizontalComponent;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormlyHorizontalComponent],
      imports: [
        FormlyBootstrapModule,
        FormlyModule.forRoot()
      ]
    });

    fixture   = TestBed.createComponent(FormlyHorizontalComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    component.field = {
      key: "title",
      type: "input",
      formControl: new FormControl(),
      templateOptions: {
        label: "Title",
        required: true
      },
      options: {
        showError: () => true
      }
    };

    (component.field as any).parent = { options: { showError: () => true} };

    const componentFactoryResolver = TestBed.get(ComponentFactoryResolver);
    const injector                 = TestBed.get(Injector);

    const formlyConfig: FormlyConfig = TestBed.get(FormlyConfig);
    const fieldComponent = formlyConfig.createComponent(component.field, componentFactoryResolver, injector);

    fieldComponent.instance.field = component.field;
    component.fieldComponent.insert(fieldComponent.hostView);
    component.field.formControl.patchValue("My title");

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should present the field wrapped", () => {
    expect(element.query(By.css(".form-group.row"))).toBeTruthy();
    expect(element.query(By.css("label")).nativeElement.innerText).toBe("Title *");
    expect(element.query(By.css("formly-validation-message"))).toBeTruthy();

    const inputElement = element.query(By.css("input"));

    expect(inputElement).toBeTruthy();
    expect(inputElement.nativeElement.value).toBe("My title");
  });
});
