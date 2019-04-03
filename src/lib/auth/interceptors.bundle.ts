import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AccessTokenInterceptor, RefreshTokenInterceptor } from "./interceptors/index";

export const AuthenticationHttpInterceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AccessTokenInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptor,
    multi: true
  }
];
