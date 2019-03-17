import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";

export const RequestFormConfig = (): FormlyFieldConfig[] => [
  {
    key: "email",
    type: "input",
    validators: { validation: ["email"] },
    templateOptions: {
      type: "email",
      required: true,
      minLength: 6,
      maxLength: 255
    }
  }
];

export const ResetFormConfig = (translate: TranslateService): FormlyFieldConfig[] => [
  {
    key: "token",
    type: "input",
    templateOptions: {
      hideLabel: true,
      type: "hidden",
      required: true
    }
  },
  {
    key: "email",
    type: "input",
    validators: { validation: ["email"] },
    templateOptions: {
      type: "email",
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

          return value.password_confirmation === value.password ||
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
