import { async, TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import * as chronos from "ngx-bootstrap/chronos";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";
import { ptBrLocale } from "ngx-bootstrap/locale";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { SetComponentsLanguageFactory } from "./set-components-language.factory";

describe("SetComponentsLanguageFactory", () => {
  const defaultLanguage = "en";
  const languageToBeSet = "pt";
  const localeToBeSet   = "pt-br";

  let bsLocaleServiceStub: Partial<BsLocaleService>;
  let translateServiceStub: Partial<TranslateService>;

  let bsLocaleServiceSpy: jasmine.SpyObj<BsLocaleService>;
  let defineLocaleSpy: jasmine.Spy;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async(() => {
    bsLocaleServiceStub  = jasmine.createSpyObj("BsLocaleService", ["use"]);
    translateServiceStub = jasmine.createSpyObj("TranslateService", ["getDefaultLang", "instant"]);

    TestBed.configureTestingModule({
      imports: [
        BsDatepickerModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      providers: [
        { provide: BsLocaleService, useValue: bsLocaleServiceStub },
        { provide: TranslateService, useValue: translateServiceStub }
      ]
    });
  }));

  beforeEach(() => {
    bsLocaleServiceSpy  = TestBed.get(BsLocaleService);

    translateServiceSpy = TestBed.get(TranslateService);
    translateServiceSpy.getDefaultLang.and.returnValue(defaultLanguage);
    translateServiceSpy.instant.and.callFake((translateKey: string) => translateKey);

    defineLocaleSpy = jasmine.createSpy("defineLocale");
    spyOnProperty(chronos, "defineLocale", "get").and.returnValue(defineLocaleSpy);
  });

  it("should set the default language of components", async () => {
    await SetComponentsLanguageFactory(bsLocaleServiceSpy, translateServiceSpy).apply(this);

    expect(bsLocaleServiceSpy.use).toHaveBeenCalledWith(defaultLanguage);

    expect(defineLocaleSpy).not.toHaveBeenCalled();
  });

  it("should set the language of components", async () => {
    translateServiceSpy.currentLang = languageToBeSet;

    await SetComponentsLanguageFactory(bsLocaleServiceSpy, translateServiceSpy).apply(this);

    expect(defineLocaleSpy).toHaveBeenCalledWith(localeToBeSet, ptBrLocale);

    expect(bsLocaleServiceSpy.use).toHaveBeenCalledWith(localeToBeSet);
  });
});
