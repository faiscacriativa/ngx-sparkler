import { CommonModule } from "@angular/common";
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { LANGUAGE_INITIALIZED } from "../i18n/injection-tokens";

import { FormlyHorizontalComponent } from "./components/formly/wrappers/horizontal/horizontal.component";
import { ValidationMessagesTranslationFactory } from "./factories/validation-messages-translation.factory";
import { ValidationRulesFactory } from "./factories/validation-rules.factory";

@NgModule({
  declarations: [FormlyHorizontalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormlyModule,
    TranslateModule
  ],
  exports: [
    FormlyHorizontalComponent,
    FormlyModule,
    ReactiveFormsModule
  ]
})
export class SparklerFormsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerFormsModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: ValidationRulesFactory,
          deps: [FormlyConfig],
          multi: true
        },
        {
          provide: LANGUAGE_INITIALIZED,
          useFactory: ValidationMessagesTranslationFactory,
          deps: [FormlyConfig, TranslateService],
          multi: true
        }
      ]
    };
  }

}
