import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";

import { FakeTranslateLoader } from "projects/ngx-sparkler/src/testing/fakes";

import { AddLanguagesNamesFactory } from "./add-languages-names.factory";

describe("AddLanguagesNamesFactory", () => {
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ]
    });
  });

  it("should add language name translation", (done: DoneFn) => {
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang("pt");
    translate.use("pt");

    // tslint:disable:object-literal-key-quotes
    AddLanguagesNamesFactory({ "en": "Inglês" }, translate)
      .apply(this)
      .then(() => {
        expect(translate.instant("en")).toBe("Inglês");
        done();
      });
  });
});
