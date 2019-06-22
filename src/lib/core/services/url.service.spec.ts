import { TestBed } from "@angular/core/testing";
import { Event, NavigationEnd, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs";

import { UrlService } from "./url.service";

describe("UrlService", () => {
  const currentURL = "http://localhost:4200/";

  let events: Observable<Event>;
  let service: UrlService;

  let routerStub: Partial<Router>;

  beforeEach(() => {
    const event = new NavigationEnd(1, currentURL, currentURL);

    events = new Observable<Event>(observer => {
      observer.next(event);
      observer.complete();
    });

    routerStub = { events, url: currentURL };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: Router, useValue: routerStub }]
    });
  });

  it("should be created", () => {
    service = TestBed.get(UrlService);

    expect(service).toBeTruthy();
  });

  it("should initialize properly", () => {
    service = TestBed.get(UrlService);

    expect(service.currentURL).toBe(currentURL);
    expect(service.previousURL).toBeNull();
  });

  it("should have a previous URL", () => {
    const nextURL = currentURL + "login";
    const event = new NavigationEnd(1, nextURL, nextURL);

    (routerStub as any).events = new Observable<Event>(observer => {
      observer.next(event);
      observer.complete();
    });

    service = TestBed.get(UrlService);

    expect(service.currentURL).toBe(nextURL);
    expect(service.previousURL).toBe(currentURL);
  });
});
