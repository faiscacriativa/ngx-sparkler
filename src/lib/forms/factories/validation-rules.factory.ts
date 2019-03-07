import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FormlyConfig, FormlyFieldConfig } from "@ngx-formly/core";

function emailValidator(control: AbstractControl, field: FormlyFieldConfig): ValidationErrors | null {
  // tslint:disable-next-line:max-line-length
  return /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(control.value) ? null : { email: true };
}

export function ValidationRulesFactory(formlyConfig: FormlyConfig) {
  return () => new Promise((resolve: any) => {
    formlyConfig.addConfig({
      validators: [
        { name: "email", validation: emailValidator }
      ]
    });

    resolve();
  });
}
