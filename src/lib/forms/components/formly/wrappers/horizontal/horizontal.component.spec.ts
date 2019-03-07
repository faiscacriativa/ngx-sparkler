import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormlyHorizontalComponent } from "./horizontal.component";

describe("FormlyHorizontalComponent", () => {
  let component: FormlyHorizontalComponent;
  let fixture: ComponentFixture<FormlyHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormlyHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
