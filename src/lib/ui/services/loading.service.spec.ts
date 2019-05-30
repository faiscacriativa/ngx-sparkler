import { TestBed } from "@angular/core/testing";

import {
  LOADING_OVERLAY_CLASS_NAME,
  LOADING_OVERLAY_HIDDEN_CLASS_NAME,
  LOADING_OVERLAY_SHOWN_CLASS_NAME,
  LOADING_OVERLAYED_CLASS_NAME,
  LoadingService
} from "./loading.service";

describe("LoadingService", () => {
  const overlayClassName   = "loading";
  const overlayedClassName = "overlayed";
  const hiddenClassName    = "hidden";
  const shownClassName     = "shown";

  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOADING_OVERLAY_CLASS_NAME, useValue: overlayClassName },
        { provide: LOADING_OVERLAYED_CLASS_NAME, useValue: overlayedClassName },
        { provide: LOADING_OVERLAY_HIDDEN_CLASS_NAME, useValue: hiddenClassName },
        { provide: LOADING_OVERLAY_SHOWN_CLASS_NAME, useValue: shownClassName }
      ]
    });

    const body    = document.querySelector("body");
    const element = document.createElement("div");

    element.classList.add(overlayClassName);

    body.appendChild(element);

    service = TestBed.get(LoadingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should show the loading overlay", () => {
    const body    = document.querySelector("body");
    const element = document.querySelector(`.${overlayClassName}`);

    service.show();

    expect(body.classList.contains(overlayedClassName)).toBeTruthy();
    expect(element.classList.contains(shownClassName)).toBeTruthy();
    expect(element.classList.contains(hiddenClassName)).toBeFalsy();
  });

  it("should hide the loading overlay", () => {
    const body    = document.querySelector("body");
    const element = document.querySelector(`.${overlayClassName}`);

    body.classList.add(overlayedClassName);
    element.classList.add(shownClassName);

    service.hide();

    expect(body.classList.contains(overlayedClassName)).toBeFalsy();
    expect(element.classList.contains(hiddenClassName)).toBeTruthy();
    expect(element.classList.contains(shownClassName)).toBeFalsy();
  });

  it("should count instantiations accordingly", () => {
    const instanceCount = 3;

    const body    = document.querySelector("body");
    const element = document.querySelector(`.${overlayClassName}`);

    body.classList.add(overlayedClassName);
    element.classList.add(shownClassName);

    for (let i = 0; i < instanceCount; i++) {
      service.show();
    }

    expect(body.classList.contains(overlayedClassName)).toBeTruthy();
    expect(element.classList.contains(shownClassName)).toBeTruthy();
    expect(element.classList.contains(hiddenClassName)).toBeFalsy();

    service.hide();

    expect(body.classList.contains(overlayedClassName)).toBeTruthy();
    expect(element.classList.contains(shownClassName)).toBeTruthy();
    expect(element.classList.contains(hiddenClassName)).toBeFalsy();

    for (let i = instanceCount; i > 0; i--) {
      service.hide();
    }

    expect(body.classList.contains(overlayedClassName)).toBeFalsy();
    expect(element.classList.contains(hiddenClassName)).toBeTruthy();
    expect(element.classList.contains(shownClassName)).toBeFalsy();
  });
});
