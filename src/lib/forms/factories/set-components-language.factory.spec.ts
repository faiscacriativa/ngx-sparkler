import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import * as chronos from "ngx-bootstrap/chronos";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { ptBrLocale } from "ngx-bootstrap/locale";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/mocks/fake-translate-loader";

import { SetComponentsLanguageFactory } from "./set-components-language.factory";

describe("SetComponentsLanguageFactory", () => {
  const defaultLanguage = "en";
  const languageToBeSet = "pt";
  const localeToBeSet   = "pt-br";

  let bsLocale: BsLocaleService;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BsDatepickerModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ]
    });

    bsLocale  = TestBed.get(BsLocaleService);
    translate = TestBed.get(TranslateService);

    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);
  });

  it("should set the default language of components", (done: DoneFn) => {
    const bsLocalUseSpy = spyOn(bsLocale, "use");

    SetComponentsLanguageFactory(bsLocale, translate)
      .apply(this)
      .then(() => {
        expect(bsLocalUseSpy).toHaveBeenCalledWith(defaultLanguage);

        done();
      });
  });

  it("should set the language of components", (done: DoneFn) => {
    const bsLocalUseSpy = spyOn(bsLocale, "use");
    const defineLocaleSpy = jasmine.createSpy("defineLocale");

    spyOnProperty(chronos, "defineLocale", "get").and.returnValue(defineLocaleSpy);

    translate.use(languageToBeSet);

    SetComponentsLanguageFactory(bsLocale, translate)
      .apply(this)
      .then(() => {
        expect(bsLocalUseSpy).toHaveBeenCalledWith(localeToBeSet);
        expect(defineLocaleSpy).toHaveBeenCalledWith(localeToBeSet, ptBrLocale);

        done();
      });
  });
});
