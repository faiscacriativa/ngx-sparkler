import { APP_INITIALIZER, Injector } from "@angular/core";

import { AuthenticationInitializerFactory } from "./factories/index";

export const SPARKLER_AUTH_FACTORIES = [
  {
    provide: APP_INITIALIZER,
    useFactory: AuthenticationInitializerFactory,
    deps: [Injector],
    multi: true
  }
];
