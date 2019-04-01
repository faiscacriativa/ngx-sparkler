import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FormlyConfig, FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { PhoneNumberUtil } from "google-libphonenumber";

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

export function ValidationRulesFactory(formlyConfig: FormlyConfig, translate: TranslateService) {
  return () => new Promise((resolve: any) => {
    formlyConfig.addConfig({
      validators: [
        { name: "email", validation: emailValidator },
        { name: "telephone", validation: telephoneValidation }
      ]
    });

    resolve();
  });
}
