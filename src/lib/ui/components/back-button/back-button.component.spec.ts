import { Location } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { UrlService } from "../../../core";

import { BackButtonComponent } from "./back-button.component";

describe("BackButtonComponent", () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  let location: Location;
  let locationStub: Partial<Location>;
  let urlService: UrlService;
  let urlServiceStub: Partial<UrlService>;

  const pathValue        = "/home";
  const previousUrlValue = "/accounts/login";

  beforeEach(async(() => {
    locationStub = {
      back: () => { },
      replaceState: ( ) => { }
    };

    urlServiceStub = { previousUrl: previousUrlValue };

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
    location   = fixture.debugElement.injector.get(Location);
    urlService = TestBed.get(UrlService);

    component.path = pathValue;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the href value equals to defined in path property", () => {
    const historyLengthSpy = spyOnProperty(history, "length", "get").and.returnValue(0);

    (urlService as any).previousUrl = undefined;

    fixture.detectChanges();

    expect(historyLengthSpy).toHaveBeenCalled();
    expect(component.href).toBe(pathValue);
    expect(component.href).not.toBe(previousUrlValue);
  });

  it("should have the path value equals previous URL", () => {
    const historyLengthSpy = spyOnProperty(history, "length", "get").and.returnValue(1);

    (urlService as any).previousUrl = previousUrlValue;

    fixture.detectChanges();

    expect(historyLengthSpy).toHaveBeenCalled();
    expect(component.href).toBe(previousUrlValue);
    expect(component.href).not.toBe(pathValue);
  });

  it("should call Location.back() when clicked", () => {
    const backButton = fixture.debugElement.query(By.css("div > div > a"));

    const historyLengthSpy        = spyOnProperty(history, "length", "get").and.returnValue(1);
    const locationBackSpy         = spyOn(location, "back");
    const locationReplaceStateSpy = spyOn(location, "replaceState");

    fixture.detectChanges();

    backButton.triggerEventHandler("click", { preventDefault: () => { } });

    expect(historyLengthSpy).toHaveBeenCalled();
    expect(locationBackSpy).toHaveBeenCalled();
    expect(locationReplaceStateSpy).not.toHaveBeenCalled();
  });

  it("should replace location state when clicked", () => {
    const backButton = fixture.debugElement.query(By.css("div > div > a"));

    const historyLengthSpy         = spyOnProperty(history, "length", "get").and.returnValue(0);
    const locationBackSpy          = spyOn(location, "back");
    const locationReplaceSteateSpy = spyOn(location, "replaceState");

    fixture.detectChanges();

    backButton.triggerEventHandler("click", { preventDefault: () => { } });

    expect(historyLengthSpy).toHaveBeenCalled();
    expect(locationReplaceSteateSpy).toHaveBeenCalled();
    expect(locationBackSpy).not.toHaveBeenCalled();
  });
});
