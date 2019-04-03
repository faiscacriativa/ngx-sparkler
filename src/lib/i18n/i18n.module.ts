import { ModuleWithProviders, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import { SPARKLER_I18N_FACTORIES } from "./factories.bundle";
import { SPARKLER_I18N_DEFAULTS } from "./injection-tokens";
import { SPARKLER_I18N_INTERCEPTORS } from "./interceptors.bundle";

@NgModule({
  imports: [TranslateModule],
  exports: [TranslateModule]
})
export class SparklerI18nModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerI18nModule,
      providers: [
        SPARKLER_I18N_DEFAULTS,
        SPARKLER_I18N_FACTORIES,
        SPARKLER_I18N_INTERCEPTORS
      ]
    };
  }

}
