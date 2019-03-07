import { Inject, Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

import { API_URL } from "../../core/services/http.service";

import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  constructor(@Inject(API_URL) private apiUrl: string) {
    this.apiUrl = this.apiUrl.replace(/\/$/, "");
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(this.apiUrl)) {
      return next.handle(request);
    }

    const accessToken = AuthenticationService.getAccessToken();

    const authorizedRequest = request.clone({
      headers: request.headers.set("Authorization", `Bearer ${accessToken}`)
    });

    return next.handle(authorizedRequest);
  }

}
