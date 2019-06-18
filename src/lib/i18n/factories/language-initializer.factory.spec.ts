import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injector } from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { DialogService } from "../../ui";
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES, LANGUAGE_INITIALIZED } from "../injection-tokens";

import { LanguageInitializerFactory } from "./language-initializer.factory";

describe("LanguageInitializerFactory", () => {
  const defaultLanguage = "pt";
  const languageToSet   = "en";

  let injector: Injector;
  let translate: TranslateService;

  let dialogServiceStub: Partial<DialogService>;

  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let initializedLanguageSpy: jasmine.Spy;

  beforeEach(async(() => {
    dialogServiceStub    = jasmine.createSpyObj("DialogService", ["error"]);

    initializedLanguageSpy = jasmine.createSpy("initializeLanguage");

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        { provide: APP_LANGUAGES, useValue: `${defaultLanguage}|${languageToSet}` },
        { provide: APP_DEFAULT_LANGUAGE, useValue: defaultLanguage },
        {
          provide: LANGUAGE_INITIALIZED,
          useFactory: () => {
            return () => new Promise((resolve) => {
              initializedLanguageSpy();
              resolve();
            });
          },
          multi: true
        },
        { provide: DialogService, useValue: dialogServiceStub }
      ]
    });
  }));

  beforeEach(() => {
    dialogServiceSpy    = TestBed.get(DialogService);

    injector  = TestBed.get(Injector);
    translate = TestBed.get(TranslateService);
  });

  it("should initialize the browser language", async () => {
    const getBrowserLangSpy = spyOn(translate, "getBrowserLang")
      .and.returnValue(languageToSet);

    await LanguageInitializerFactory(dialogServiceSpy, injector, translate).apply(this);

    expect(getBrowserLangSpy).toHaveBeenCalled();

    expect(translate.currentLang).toBe(languageToSet);
    expect(translate.currentLang).not.toBe(defaultLanguage);

    expect(initializedLanguageSpy).toHaveBeenCalled();
  });

  it("should initialize the default language when the browser language is not supported", async () => {
    const getBrowserLangSpy = spyOn(translate, "getBrowserLang").and.returnValue("de");

    await LanguageInitializerFactory(dialogServiceSpy, injector, translate).apply(this);

    expect(getBrowserLangSpy).toHaveBeenCalled();

    expect(translate.currentLang).toBe(defaultLanguage);
    expect(translate.currentLang).not.toBe(languageToSet);

    expect(initializedLanguageSpy).toHaveBeenCalled();
  });

  it("should initialize default language when the browser language fails to be initialized", async () => {
    const getBrowserLangSpy = spyOn(translate, "getBrowserLang").and.returnValue(languageToSet);
    const useSpy = spyOn(translate, "use").and
      .returnValues(
        throwError(new HttpErrorResponse({ status: 400, statusText: "Bad Request" })),
        of(new HttpResponse({ status: 200, statusText: "Ok" }))
      );

    await LanguageInitializerFactory(dialogServiceSpy, injector, translate).apply(this);

    expect(getBrowserLangSpy).toHaveBeenCalled();

    expect(useSpy).toHaveBeenCalledTimes(2);
  });

  it("should fail to initialize any language and show a message to the user", (done: Function) => {
    const useSpy = spyOn(translate, "use")
      .and.returnValue(throwError(
        new HttpErrorResponse({ status: 400, statusText: "Bad Request" })
      ));

    LanguageInitializerFactory(dialogServiceSpy, injector, translate)
      .apply(this)
      .then(() => done(new Error("Promise should be rejected.")))
      .catch(() => {
        expect(useSpy).toHaveBeenCalled();

        expect(dialogServiceSpy.error).toHaveBeenCalledWith(
          "Failed to load language.\nFalha ao carregar a linguagem.",
          {
            titleText: null,
            allowOutsideClick: false,
            showConfirmButton: false
          }
        );

        done();
      });
  });
});
