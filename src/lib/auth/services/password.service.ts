import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiResponse } from "../../core/interfaces/index";
import { HttpService } from "../../core/services/index";

import {
  PASSWORD_RESET_ENDPOINT,
  PASSWORD_RESET_REQUEST_ENDPOINT,
  PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT
} from "../injection-tokens";

@Injectable({
  providedIn: "root"
})
export class PasswordService {

  constructor(
    @Inject(PASSWORD_RESET_ENDPOINT) private resetEndpoint,
    @Inject(PASSWORD_RESET_REQUEST_ENDPOINT) private requestEndpoint,
    @Inject(PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT) private tokenValidationEndpoint,
    private http: HttpService
  ) {
    this.resetEndpoint = resetEndpoint.replace(/^\//, "");
    this.requestEndpoint = requestEndpoint.replace(/^\//, "");
    this.tokenValidationEndpoint = this.tokenValidationEndpoint.replace(/^\//, "");
  }

  public request(email: string): Observable<ApiResponse> {
    return this.http.post(`/${this.requestEndpoint}`, { email });
  }

  public reset(data: any): Observable<ApiResponse> {
    return this.http.post(`/${this.resetEndpoint}`, data);
  }

}
