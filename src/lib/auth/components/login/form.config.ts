import { FormlyFieldConfig } from "@ngx-formly/core";

export const FormConfig = (): FormlyFieldConfig[] => [
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
    type: "input",
    templateOptions: {
      type: "password",
      required: true,
      minLength: 6,
      maxLength: 255
    }
  }
];
