import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { HttpClientTestingModule , HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/mocks/fake-translate-loader";

import { APP_DEFAULT_LANGUAGE } from "../injection-tokens";

import { AcceptLanguageInterceptor } from "./accept-language.interceptor";

describe("AcceptLanguageInterceptor", () => {
  const appDefaultLanguage = "en";
  const appLanguage = "pt";
  const endpoint = "http://google.com";

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        { provide: APP_DEFAULT_LANGUAGE, useValue: appDefaultLanguage },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AcceptLanguageInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    translateService = TestBed.get(TranslateService);

    translateService.setDefaultLang(appDefaultLanguage);
    translateService.use(appDefaultLanguage);
  });

  it("should add an Accept-Language header with the default language", () => {
    spyOnProperty(translateService, "currentLang").and.returnValue(null);

    httpClient.get(endpoint).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpTestingController.expectOne(endpoint);

    expect(httpRequest.request.headers.has("Accept-Language")).toEqual(true);
    expect(httpRequest.request.headers.get("Accept-Language")).toEqual(appDefaultLanguage);
  });

  it("should add an Accept-Language header with the app language", () => {
    translateService.use(appLanguage);

    httpClient.get(endpoint).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpTestingController.expectOne(endpoint);

    expect(httpRequest.request.headers.has("Accept-Language")).toEqual(true);
    expect(httpRequest.request.headers.get("Accept-Language")).toEqual(appLanguage);
  });
});
