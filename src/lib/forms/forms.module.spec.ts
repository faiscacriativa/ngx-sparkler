import { async, TestBed } from "@angular/core/testing";
import { FormlyConfig } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BsLocaleService } from "ngx-bootstrap/datepicker";

import { FakeTranslateLoader } from "../../testing/fakes";
import { SparklerI18nModule } from "../i18n";

import { SparklerFormsModule } from "./forms.module";

describe("SparklerForm", () => {
  const FakeBsLocaleService = {
    use: jasmine.createSpy("FakeBsLocalService.use")
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
          }),
          SparklerI18nModule.forRoot(),
          SparklerFormsModule.forRoot()
        ],
        providers: [
          { provide: BsLocaleService, useValue: FakeBsLocaleService }
        ]
      })
      .compileComponents();
  }));

  describe("forRoot", () => {
    let formlyConfig: FormlyConfig;

    beforeEach(() => {
      formlyConfig = TestBed.get(FormlyConfig);
    });

    it("should provide Formly configurations", () => {
      const formlyTypes    = formlyConfig.types;
      const formlyWrappers = formlyConfig.wrappers;

      expect(formlyTypes.datepicker).toBeDefined();
      expect(formlyWrappers["form-field-horizontal"]).toBeDefined();
    });

    it("should provide Formly validations", () => {
      const formlyMessages   = formlyConfig.messages;
      const formlyValidators = formlyConfig.validators;

      expect(formlyMessages.email).toBeTruthy();
      expect(formlyMessages.required).toBeTruthy();
      expect(formlyMessages.maxlength).toBeTruthy();
      expect(formlyMessages.minlength).toBeTruthy();
      expect(formlyMessages.pattern).toBeTruthy();
      expect(formlyMessages.telephone).toBeTruthy();

      expect(formlyValidators.date).toBeTruthy();
      expect(formlyValidators.email).toBeTruthy();
      expect(formlyValidators.telephone).toBeTruthy();
    });

    it("should set locale for some components", () => {
      const bsLocale = TestBed.get(BsLocaleService);

      expect(bsLocale.use).toHaveBeenCalled();
    });
  });
});
