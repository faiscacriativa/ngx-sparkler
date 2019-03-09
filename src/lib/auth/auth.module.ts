import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule
} from "@angular/core";
import { RouterModule } from "@angular/router";

import { SparklerCoreModule } from "../core/core.module";
import { SparklerFormsModule } from "../forms/forms.module";
import { SparklerI18nModule } from "../i18n/i18n.module";

import { LoginComponent } from "./components/login/login.component";
import { AuthenticationInitializerFactory } from "./factories/authentication-initializer.factory";
import { AuthenticationHttpInterceptors } from "./interceptors/interceptors-bundle";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule,

    SparklerCoreModule,
    SparklerFormsModule,
    SparklerI18nModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    AuthenticationHttpInterceptors
  ]
})
export class SparklerAuthModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerAuthModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: AuthenticationInitializerFactory,
          deps: [Injector],
          multi: true
        }
      ]
    };
  }

}
