import { Injector } from "@angular/core";

import { User } from "../interfaces";
import { AuthenticationService } from "../services/index";

export function AuthenticationInitializerFactory(injector: Injector) {
  return () => new Promise<User>((resolve: any) => {
    const auth = injector.get(AuthenticationService);
    auth.fetchUser().subscribe((user: User) => resolve(user));
  });
}
