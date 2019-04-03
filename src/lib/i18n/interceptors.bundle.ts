import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AcceptLanguageInterceptor } from "./interceptors/index";

export const SPARKLER_I18N_INTERCEPTORS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AcceptLanguageInterceptor,
    multi: true
  }
];
