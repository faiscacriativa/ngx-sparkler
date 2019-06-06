import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { DatepickerComponent } from "./datepicker.component";

describe("DatepickerComponent", () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatepickerComponent],
      imports: [
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        FormlyBootstrapModule,
        FormlyModule.forRoot({
          types: [
            {
              name: "datepicker",
              component: DatepickerComponent,
              wrappers: ["form-field"]
            }
          ]
        })
      ]
    });

    fixture   = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    element   = fixture.debugElement;

    component.field = {
      key: "dateofbirth",
      type: "datepicker",
      formControl: new FormControl(),
      templateOptions: {
        label: "Date of birth",
        required: true,
        datepicker: { containerClass: "theme-default" }
      },
      options: {
        showError: () => true
      }
    };

    (component.field as any).parent = { options: { showError: () => true } };

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.datepicker.isOpen).toBe(false);
  });

  it("should show datepicker", () => {
    element.query(By.css("input")).triggerEventHandler("click", { });
    expect(component.datepicker.isOpen).toBe(true);
  });
});
