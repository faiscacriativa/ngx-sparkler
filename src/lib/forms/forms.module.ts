import { CommonModule } from "@angular/common";
import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { SPARKLER_FACTORIES_PROVIDER } from "./factories.bundle";
import { SPARKLER_FORMLY_COMPONENTS, SPARKLER_FORMLY_CONFIG } from "./formly.config";

@NgModule({
  declarations: [
    SPARKLER_FORMLY_COMPONENTS
  ],
  imports: [
    CommonModule,
    BsDatepickerModule,
    ReactiveFormsModule,

    FormlyModule,
    TranslateModule
  ],
  exports: [
    FormlyModule,
    ReactiveFormsModule
  ]
})
export class SparklerFormsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerFormsModule,
      providers: [
        SPARKLER_FACTORIES_PROVIDER,
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: SPARKLER_FORMLY_CONFIG,
          multi: true
        }
      ]
    };
  }

}
