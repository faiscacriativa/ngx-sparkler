import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AcceptLanguageInterceptor } from "./accept-language.interceptor";

export const CoreHttpInterceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AcceptLanguageInterceptor,
    multi: true
  }
];
