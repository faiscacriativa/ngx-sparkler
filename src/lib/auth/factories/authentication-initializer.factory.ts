import { Injector } from "@angular/core";

import { AuthenticationService } from "../services/authentication.service";

export function AuthenticationInitializerFactory(injector: Injector) {
  return () => new Promise((resolve: any) => {
    const auth = injector.get(AuthenticationService);
    auth.fetchUser().subscribe(() => resolve());
  });
}
