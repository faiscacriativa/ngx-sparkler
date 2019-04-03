import { Injector } from "@angular/core";

import { AuthenticationService } from "../services/index";

export function AuthenticationInitializerFactory(injector: Injector) {
  return () => new Promise((resolve: any) => {
    const auth = injector.get(AuthenticationService);
    auth.fetchUser().subscribe(() => resolve());
  });
}
