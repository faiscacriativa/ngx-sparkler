import { AbstractControl } from "@angular/forms";
import { FormlyConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import * as _moment from "moment";
import { getLocale } from "ngx-bootstrap/chronos";

const moment = _moment;

function defineDateValidation(
  translate: TranslateService
): (control: AbstractControl) => any {
  return (control: AbstractControl) => {
    let currentLanguage = translate.currentLang;

    switch (currentLanguage) {
    case "pt":
      currentLanguage = "pt-BR";
      break;
    }

    const format = getLocale(currentLanguage).longDateFormat("L");

    return moment(control.value, format, true).isValid() ? null : { date: true };
  };
}

export function LanguageDependentValidatorsFactory(
  formlyConfig: FormlyConfig,
  translate: TranslateService
) {
  return () => new Promise((resolve: any) => {
    formlyConfig.addConfig({
      validators: [
        { name: "date", validation: defineDateValidation(translate) }
      ]
    });

    resolve();
  });
}
