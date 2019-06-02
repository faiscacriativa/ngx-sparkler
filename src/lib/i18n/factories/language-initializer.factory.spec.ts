import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/mocks/fake-translate-loader";
import { of, throwError } from "rxjs";
import { SweetAlertResult } from "sweetalert2";

import { DialogService } from "../../ui";

import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES, LANGUAGE_INITIALIZED } from "../injection-tokens";

import { LanguageInitializerFactory } from "./language-initializer.factory";

describe("LanguageInitializerFactory", () => {
  const defaultLanguage = "pt";
  const languageToSet   = "en";

  const languageInitializedListener = jasmine.createSpy();
  const dialogStub: Partial<DialogService> = { error: () => Promise.resolve<SweetAlertResult>({}) };

  let dialog: DialogService;
  let injector: Injector;
  let translate: TranslateService;
  let languageInitializedListenersCalledTimes = 0;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        { provide: DialogService, useValue: dialogStub },
        { provide: APP_LANGUAGES, useValue: `${defaultLanguage}|${languageToSet}` },
        { provide: APP_DEFAULT_LANGUAGE, useValue: defaultLanguage },
        {
          provide: LANGUAGE_INITIALIZED,
          useFactory: () => {
            return () => new Promise((resolve) => {
              languageInitializedListener();
              resolve();
            });
          },
          multi: true
        }
      ]
    });

    dialog    = TestBed.get(DialogService);
    injector  = TestBed.get(Injector);
    translate = TestBed.get(TranslateService);
  });

  it("should initialize the browser language", (done: DoneFn) => {
    const getBrowserLangSpy = spyOn(translate, "getBrowserLang").and.returnValue(languageToSet);

    LanguageInitializerFactory(dialog, injector, translate)
      .apply(this)
      .then(() => {
        expect(getBrowserLangSpy).toHaveBeenCalled();
        expect(translate.currentLang).toBe(languageToSet);
        expect(translate.currentLang).not.toBe(defaultLanguage);

        done();
      })
      .catch(() => done());

    ++languageInitializedListenersCalledTimes;
  });

  it("should initialize the default language when the browser language is not supported", (done: DoneFn) => {
    const getBrowserLangSpy = spyOn(translate, "getBrowserLang").and.returnValue("de");

    LanguageInitializerFactory(dialog, injector, translate)
      .apply(this)
      .then(() => {
        expect(getBrowserLangSpy).toHaveBeenCalled();
        expect(translate.currentLang).toBe(defaultLanguage);
        expect(translate.currentLang).not.toBe(languageToSet);

        done();
      })
      .catch(() => done());

    ++languageInitializedListenersCalledTimes;
  });

  it("should initialize default language when the browser language fails to be initialized", (done: DoneFn) => {
    const getBrowserLangSpy = spyOn(translate, "getBrowserLang").and.returnValue(languageToSet);
    const useSpy = spyOn(translate, "use").and
      .returnValues(
        throwError(new HttpErrorResponse({ status: 400, statusText: "Bad Request" })),
        of(new HttpResponse({ status: 200, statusText: "Ok" }))
      );

    LanguageInitializerFactory(dialog, injector, translate)
      .apply(this)
      .then(() => {
        expect(getBrowserLangSpy).toHaveBeenCalled();
        expect(useSpy).toHaveBeenCalled();

        done();
      })
      .catch(() => done());

    ++languageInitializedListenersCalledTimes;
  });

  it("should fail to initialize any language and show a message to the user", (done: DoneFn) => {
    const useSpy = spyOn(translate, "use").and
      .returnValue(throwError(new HttpErrorResponse({ status: 400, statusText: "Bad Request" })));
    const dialogErrorSpy = spyOn(dialog, "error").and.callThrough();

    LanguageInitializerFactory(dialog, injector, translate)
      .apply(this)
      .then(() => done())
      .catch(() => {
        expect(useSpy).toHaveBeenCalled();
        expect(dialogErrorSpy).toHaveBeenCalled();

        done();
      });
  });

  it("should call language initialized listener", () => {
    expect(languageInitializedListener).toHaveBeenCalledTimes(languageInitializedListenersCalledTimes);
  });
});
