import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";

import { TranslateLoaderFactory } from "./translate-loader.factory";

describe("TranslateLoaderFactory", () => {
  let httpClient: HttpClient;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
  }));

  it("should create a TranslateHttpLoader instance", () => {
    expect(TranslateLoaderFactory(httpClient)).toBeTruthy();
  });
});
