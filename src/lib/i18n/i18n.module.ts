import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule
  } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { DialogService } from "../ui/services/dialog.service";

import { AddLanguagesNamesFactory } from "./factories/add-languages-names.factory";
import { LanguageInitializerFactory } from "./factories/language-initializer.factory";
import {
  APP_DEFAULT_LANGUAGE,
  APP_LANGUAGES,
  LANGUAGE_INITIALIZED,
  LANGUAGE_NAMES
} from "./injection-tokens";
import { CoreHttpInterceptors } from "./interceptors/interceptors-bundle";

@NgModule({
  imports: [TranslateModule],
  exports: [TranslateModule]
})
export class SparklerI18nModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerI18nModule,
      providers: [
        CoreHttpInterceptors,
        { provide: APP_LANGUAGES, useValue: new RegExp("(en|pt)", "i") },
        { provide: APP_DEFAULT_LANGUAGE, useValue: "en" },
        {
          provide: APP_INITIALIZER,
          useFactory: LanguageInitializerFactory,
          deps: [DialogService, Injector, TranslateService],
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
