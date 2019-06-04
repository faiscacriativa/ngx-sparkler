import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FormlyConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { PhoneNumberUtil } from "google-libphonenumber";
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

function emailValidator(control: AbstractControl): ValidationErrors | null {
  // tslint:disable-next-line:max-line-length
  return /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(control.value) ? null : { email: true };
}

function telephoneValidation(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  try {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const phoneNumber = phoneNumberUtil.parse(control.value);

    return phoneNumberUtil.isValidNumber(phoneNumber) ? null : { telephone: true };
  } catch (exception) {
    return { telephone: true };
  }
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
        { name: "email", validation: emailValidator },
        { name: "telephone", validation: telephoneValidation }
      ]
    });

    resolve();
  });
}
