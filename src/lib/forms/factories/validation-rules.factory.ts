import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FormlyConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { getLocale } from "ngx-bootstrap/chronos";

import { dateValidator, emailValidator, telephoneValidator } from "../validators";

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

    return dateValidator(control.value, format) ? null : { date: true };
  };
}

function emailValidation(control: AbstractControl): ValidationErrors | null {
  return emailValidator(control.value) ? null : { email: true };
}

function telephoneValidation(control: AbstractControl): ValidationErrors | null {
  return telephoneValidator(control.value) ? null : { telephone: true };
}

export function ValidationRulesFactory(
  formlyConfig: FormlyConfig,
  translate: TranslateService
) {
  return () => new Promise((resolve: any) => {
    formlyConfig.addConfig({
      validationMessages: [
        { name: "email", message: translate.instant("validation.email") },
        { name: "required", message: translate.instant("validation.required") },
        {
          name: "maxlength",
          message: (error: any) => translate.instant(
            "validation.maxLength",
            { chars: error.actualLength - error.requiredLength }
          )
        },
        {
          name: "minlength",
          message: (error: any) => translate.instant(
            "validation.minLength",
            { charsLeft: error.requiredLength - error.actualLength }
          )
        },
        { name: "pattern", message: translate.instant("validation.pattern") },
        { name: "telephone", message: translate.instant("validation.telephone") }
      ],
      validators: [
        { name: "date", validation: defineDateValidation(translate) },
        { name: "email", validation: emailValidation },
        { name: "telephone", validation: telephoneValidation }
      ]
    });

    resolve();
  });
}
