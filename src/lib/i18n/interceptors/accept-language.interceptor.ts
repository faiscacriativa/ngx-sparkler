import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

import { APP_DEFAULT_LANGUAGE } from "../injection-tokens";

@Injectable()
export class AcceptLanguageInterceptor implements HttpInterceptor {

  constructor(
    @Inject(APP_DEFAULT_LANGUAGE) private defaultLanguage,
    private translate: TranslateService
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestLanguage = this.defaultLanguage;

    if (this.translate.currentLang) {
      requestLanguage = this.translate.currentLang;
    }

    const requestClone = request.clone({
      headers: request.headers.set("Accept-Language", requestLanguage)
    });

    return next.handle(requestClone);
  }

}
