import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";

import { valueMatchValidator } from "../../../forms";

export const FormConfig = (translate: TranslateService): FormlyFieldConfig[] => [
  {
    key: "current_password",
    type: "input",
    templateOptions: {
      type: "password",
      required: true,
      minLength: 6,
      maxLength: 255
    }
  },
  {
    key: "password",
    validators: {
      fieldMatch: {
        expression: (control: FormGroup) => {
          const value = control.value;

          return valueMatchValidator(value.password, value.password_confirmation) ||
            /* istanbul ignore next */
            (!value.password_confirmation || !value.password);
        },
        message: translate.instant("validation.passwordMismatch"),
        errorPath: "password_confirmation",
      },
    },
    fieldGroup: [
      {
        key: "password",
        type: "input",
        templateOptions: {
          type: "password",
          required: true,
          minLength: 6,
          maxLength: 255
        }
      },
      {
        key: "password_confirmation",
        type: "input",
        templateOptions: {
          type: "password",
          required: true,
          minLength: 6,
          maxLength: 255
        }
      }
    ]
  }
];
