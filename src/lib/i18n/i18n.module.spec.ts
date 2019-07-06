import { async, TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";

import { FakeTranslateLoader } from "../../testing/fakes";

import { SparklerI18nModule } from "./i18n.module";
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES, LANGUAGE_NAMES } from "./injection-tokens";

describe("SparklerI18nModule", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        }),

        SparklerI18nModule.forRoot()
      ]
    });
  }));

  describe("forRoot", () => {
    it("should define the default values for injection tokens", () => {
      const appDefaultLanguage = TestBed.get(APP_DEFAULT_LANGUAGE);
      expect(appDefaultLanguage).toBe("en");

      const appLanguages = TestBed.get(APP_LANGUAGES);
      expect(appLanguages).toEqual(new RegExp("(en|pt)", "i"));

      const languageNames = TestBed.get(LANGUAGE_NAMES);
      expect(languageNames).toEqual({
        "language.en": "English",
        "language.pt": "Português"
      });
    });

    it("should provide the factories for language initialization", () => {
      const appDefaultLanguage: string  = TestBed.get(APP_DEFAULT_LANGUAGE);
      const appLanguages: RegExp        = TestBed.get(APP_LANGUAGES);
      const translate: TranslateService = TestBed.get(TranslateService);

      const browserLanguage: string = translate.getBrowserLang();
      const languageToSet = browserLanguage.match(appLanguages) ? browserLanguage : appDefaultLanguage;

      expect(translate.defaultLang).toBe(appDefaultLanguage);
      expect(translate.currentLang).toBe(languageToSet);
      expect(translate.instant("language.en")).toBe("English");
    });
  });
});
