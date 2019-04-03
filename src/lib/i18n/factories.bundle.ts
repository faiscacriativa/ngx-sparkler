import { APP_INITIALIZER, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { DialogService } from "../ui/services/index";

import { AddLanguagesNamesFactory, LanguageInitializerFactory } from "./factories/index";
import { LANGUAGE_INITIALIZED, LANGUAGE_NAMES } from "./injection-tokens";

export const SPARKLER_I18N_FACTORIES = [
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
  }
];
