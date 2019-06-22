import { TestBed } from "@angular/core/testing";
import * as Platform from "platform";

import { PlatformService } from "./platform.service";

describe("PlatformService", () => {
  const originalUA = window.navigator.userAgent;
  const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
  const mobileUA = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"; // tslint:disable-line
  const phoneUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
  const tabletUA = "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

  let service: PlatformService;

  beforeEach(() => TestBed.configureTestingModule({ }));

  afterEach(() => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => originalUA);
  });

  it("should be created", () => {
    service = TestBed.get(PlatformService);

    expect(service).toBeTruthy();
  });

  it("should return the platform name and version", () => {
    const currentPlatform = {
      name: Platform.name,
      version: Platform.version
    };

    service = TestBed.get(PlatformService);

    expect(service.browser()).toEqual(jasmine.objectContaining(currentPlatform));
  });

  it("should return that the platform is a desktop", () => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => desktopUA);

    service = TestBed.get(PlatformService);

    expect(service.isDesktop()).toBe(true);
  });

  it("should return that the platform is a mobile", () => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => mobileUA);

    service = TestBed.get(PlatformService);

    expect(service.isMobile()).toBe(true);
  });

  it("should return that the platform is a phone", () => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => phoneUA);

    service = TestBed.get(PlatformService);

    expect(service.isPhone()).toBe(true);
  });

  it("should return that the platform is a tablet", () => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => tabletUA);

    service = TestBed.get(PlatformService);

    expect(service.isTablet()).toBe(true);
  });

  it("should detect the mobile device brand", () => {
    // tslint:disable-next-line:max-line-length no-string-literal
    navigator["__defineGetter__"]("userAgent", () => mobileUA);

    service = TestBed.get(PlatformService);

    expect(service.mobile()).toBeTruthy();
  });

  it("should detect the operational system of the device", () => {
    service = TestBed.get(PlatformService);

    expect(service.os()).toBe(Platform.os);
  });

  it("should detect the phone device brand", () => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => phoneUA);

    service = TestBed.get(PlatformService);

    expect(service.phone()).toBe("iPhone");
  });

  it("should detect the tablet device brand", () => {
    // tslint:disable-next-line:no-string-literal
    navigator["__defineGetter__"]("userAgent", () => tabletUA);

    service = TestBed.get(PlatformService);

    expect(service.tablet()).toBe("iPad");
  });

  it("should return the user agent", () => {
    const currentUserAgent = window.navigator.userAgent;

    expect(service.userAgent()).toBe(currentUserAgent);
  });
});
