import { TestBed } from "@angular/core/testing";

import { AcceptLanguageInterceptor } from "./accept-language.interceptor";

describe("AcceptLanguageInterceptor", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: AcceptLanguageInterceptor = TestBed.get(AcceptLanguageInterceptor);
    expect(service).toBeTruthy();
  });
});
