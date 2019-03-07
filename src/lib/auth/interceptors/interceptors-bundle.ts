import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AccessTokenInterceptor } from "./access-token.interceptor";
import { RefreshTokenInterceptor } from "./refresh-token.interceptor";

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
