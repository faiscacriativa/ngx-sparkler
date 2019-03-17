import { CommonModule } from "@angular/common";
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

import { EmailVerifierComponent } from "./components/email-verifier/email-verifier.component";
import { LoginComponent } from "./components/login/login.component";
import { PasswordResetComponent } from "./components/password-reset/password-reset.component";
import { AuthenticationInitializerFactory } from "./factories/authentication-initializer.factory";
import { AuthenticationHttpInterceptors } from "./interceptors/interceptors-bundle";

@NgModule({
  declarations: [
    EmailVerifierComponent,
    LoginComponent,
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    SparklerCoreModule,
    SparklerFormsModule,
    SparklerI18nModule
  ],
  exports: [
    EmailVerifierComponent,
    LoginComponent
  ]
})
export class SparklerAuthModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SparklerAuthModule,
      providers: [
        AuthenticationHttpInterceptors,
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
