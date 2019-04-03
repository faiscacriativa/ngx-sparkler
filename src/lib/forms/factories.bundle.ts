import { APP_INITIALIZER } from "@angular/core";
import { FormlyConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { BsLocaleService } from "ngx-bootstrap/datepicker";

import { LANGUAGE_INITIALIZED } from "../i18n/injection-tokens";

import { FormlyConfigFactory, SetComponentsLanguageFactory, ValidationRulesFactory } from "./factories/index";

export const SPARKLER_FACTORIES_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: FormlyConfigFactory,
    deps: [FormlyConfig],
    multi: true
  },
  {
    provide: LANGUAGE_INITIALIZED,
    useFactory: ValidationRulesFactory,
    deps: [FormlyConfig, TranslateService],
    multi: true
  },
  {
    provide: LANGUAGE_INITIALIZED,
    useFactory: SetComponentsLanguageFactory,
    deps: [BsLocaleService, TranslateService],
    multi: true
  }
];
