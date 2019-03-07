import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { AddLanguagesNamesFactory } from "./factories/add-languages-names.factory";
import { LanguageInitializerFactory } from "./factories/language-initializer.factory";

import {
  APP_DEFAULT_LANGUAGE,
  APP_LANGUAGES,
  LANGUAGE_INITIALIZED,
  LANGUAGE_NAMES
} from "./injection-tokens";

@NgModule({
})
export class SparklerI18nModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerI18nModule,
      providers: [
        { provide: APP_LANGUAGES, useValue: new RegExp("(en|pt)", "i") },
        { provide: APP_DEFAULT_LANGUAGE, useValue: "en" },
        {
          provide: APP_INITIALIZER,
          useFactory: LanguageInitializerFactory,
          deps: [Injector, TranslateService],
          multi: true
        },
        {
          provide: LANGUAGE_INITIALIZED,
          useFactory: AddLanguagesNamesFactory,
          deps: [LANGUAGE_NAMES, TranslateService],
          multi: true
        },
        {
          provide: LANGUAGE_NAMES,
          useValue: {
            "language.en": "English",
            "language.pt": "Português"
          }
        }
      ]
    };
  }

}
