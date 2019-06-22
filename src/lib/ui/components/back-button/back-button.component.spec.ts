import { Location } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { UrlService } from "../../../core";

import { BackButtonComponent } from "./back-button.component";

describe("BackButtonComponent", () => {
  const previousUrlValue = "/accounts/login";
  const pathValue        = "/home";

  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  let locationStub: Partial<Location>;
  let urlServiceStub: Partial<UrlService>;

  let locationSpy: jasmine.SpyObj<Location>;
  let urlServiceSpy: jasmine.SpyObj<UrlService>;

  beforeEach(async(() => {
    locationStub = jasmine.createSpyObj("Location", ["back", "replaceState"]);
    urlServiceStub = { previousURL: undefined };

    TestBed.configureTestingModule({
      declarations: [ BackButtonComponent ],
      providers: [
        { provide: Location, useValue: locationStub },
        { provide: UrlService, useValue: urlServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture    = TestBed.createComponent(BackButtonComponent);
    component  = fixture.debugElement.componentInstance;

    locationSpy   = TestBed.get(Location);
    urlServiceSpy = TestBed.get(UrlService);

    component.path = pathValue;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the href value equals to defined in path property", () => {
    const historyLengthSpy = spyOnProperty(history, "length", "get").and.returnValue(0);

    (urlServiceSpy as any).previousURL = undefined;

    fixture.detectChanges();

    expect(historyLengthSpy).toHaveBeenCalled();

    expect(component.href).toBe(pathValue);
    expect(component.href).not.toBe(previousUrlValue);
  });

  it("should have the path value equals previous URL", () => {
    const historyLengthSpy = spyOnProperty(history, "length", "get").and.returnValue(1);

    (urlServiceSpy as any).previousURL = previousUrlValue;

    fixture.detectChanges();

    expect(historyLengthSpy).toHaveBeenCalled();

    expect(component.href).toBe(previousUrlValue);
    expect(component.href).not.toBe(pathValue);
  });

  it("should call Location.back() when clicked", () => {
    const backButton = fixture.debugElement.query(By.css("div > div > a"));
    const historyLengthSpy = spyOnProperty(history, "length", "get").and.returnValue(1);

    fixture.detectChanges();

    backButton.triggerEventHandler("click", { preventDefault: () => { } });

    expect(historyLengthSpy).toHaveBeenCalled();

    expect(locationSpy.back).toHaveBeenCalled();
    expect(locationSpy.replaceState).not.toHaveBeenCalled();
  });

  it("should replace location state when clicked", () => {
    const backButton = fixture.debugElement.query(By.css("div > div > a"));
    const historyLengthSpy = spyOnProperty(history, "length", "get").and.returnValue(0);

    fixture.detectChanges();

    backButton.triggerEventHandler("click", { preventDefault: () => { } });

    expect(historyLengthSpy).toHaveBeenCalled();

    expect(locationSpy.back).not.toHaveBeenCalled();
    expect(locationSpy.replaceState).toHaveBeenCalled();
  });
});
