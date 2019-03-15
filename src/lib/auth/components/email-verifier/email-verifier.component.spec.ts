import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EmailVerifierComponent } from "./email-verifier.component";

describe("EmailVerifierComponent", () => {
  let component: EmailVerifierComponent;
  let fixture: ComponentFixture<EmailVerifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
