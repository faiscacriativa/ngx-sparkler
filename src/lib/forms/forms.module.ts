import { CommonModule } from "@angular/common";
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyConfig, FormlyModule } from "@ngx-formly/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker";

import { LANGUAGE_INITIALIZED } from "../i18n/injection-tokens";

import { DatepickerComponent } from "./components/formly/types/datepicker/datepicker.component";
import { FormlyHorizontalComponent } from "./components/formly/wrappers/horizontal/horizontal.component";
import { LanguageDependentValidatorsFactory } from "./factories/language-dependent-validators.factory";
import { SetComponentsLanguageFactory } from "./factories/set-components-language.factory";
import { ValidationMessagesTranslationFactory } from "./factories/validation-messages-translation.factory";
import { ValidationRulesFactory } from "./factories/validation-rules.factory";

@NgModule({
  declarations: [
    DatepickerComponent,
    FormlyHorizontalComponent
  ],
  imports: [
    CommonModule,
    BsDatepickerModule,
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
        },
        {
          provide: LANGUAGE_INITIALIZED,
          useFactory: LanguageDependentValidatorsFactory,
          deps: [FormlyConfig, TranslateService],
          multi: true
        },
        {
          provide: LANGUAGE_INITIALIZED,
          useFactory: SetComponentsLanguageFactory,
          deps: [BsLocaleService, TranslateService],
          multi: true
        }
      ]
    };
  }

}
