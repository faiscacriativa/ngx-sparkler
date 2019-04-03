import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SparklerCoreModule } from "../core/index";
import { SparklerFormsModule } from "../forms/index";
import { SparklerI18nModule } from "../i18n/index";

import { SPARKLER_AUTH_COMPONENTS } from "./components.bundle";
import { SPARKLER_AUTH_FACTORIES } from "./factories.bundle";
import { SPARKLER_AUTH_DEFAULTS } from "./injection-tokens";
import { AuthenticationHttpInterceptors } from "./interceptors.bundle";

@NgModule({
  declarations: [
    SPARKLER_AUTH_COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,

    SparklerCoreModule,
    SparklerFormsModule,
    SparklerI18nModule
  ],
  exports: [
    SPARKLER_AUTH_COMPONENTS
  ]
})
export class SparklerAuthModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerAuthModule,
      providers: [
        SPARKLER_AUTH_DEFAULTS,
        SPARKLER_AUTH_FACTORIES,
        AuthenticationHttpInterceptors
      ]
    };
  }

}
