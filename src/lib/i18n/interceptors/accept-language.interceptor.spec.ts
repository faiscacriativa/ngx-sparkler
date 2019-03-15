import { TestBed } from "@angular/core/testing";

import { AcceptLanguageService } from "./accept-language.service";

describe("AcceptLanguageService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: AcceptLanguageService = TestBed.get(AcceptLanguageService);
    expect(service).toBeTruthy();
  });
});
