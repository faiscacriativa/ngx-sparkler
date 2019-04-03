import { ConfigOption } from "@ngx-formly/core";
import { DatepickerComponent } from "./components/formly/types/datepicker/datepicker.component";
import { FormlyHorizontalComponent } from "./components/formly/wrappers/horizontal/horizontal.component";

export const SPARKLER_FORMLY_COMPONENTS = [
  // Fields Types
  DatepickerComponent,

  // Wrappers
  FormlyHorizontalComponent
];

export const SPARKLER_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: "datepicker",
      component: DatepickerComponent,
      wrappers: ["form-field"]
    }
  ],
  wrappers: [
    {
      name: "form-field-horizontal",
      component: FormlyHorizontalComponent
    }
  ]
};
