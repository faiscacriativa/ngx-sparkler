import { Inject, Injectable } from "@angular/core";

import { HttpService } from "../../core/services/http.service";
import {
  EMAIL_VERIFICATION_ENDPOINT,
  EMAIL_VERIFICATION_RESEND_ENDPOINT
} from "../injection-tokens";

@Injectable({
  providedIn: "root"
})
export class EmailVerificationService {

  constructor(
    @Inject(EMAIL_VERIFICATION_ENDPOINT) private emailVerificationEndpoint: string,
    @Inject(EMAIL_VERIFICATION_RESEND_ENDPOINT) private emailVerificationResendEndpoint: string,
    private http: HttpService
  ) {
    this.emailVerificationEndpoint = emailVerificationEndpoint.replace(/^\//, "");
  }

  public verify(userId: number, verifyData: any) {
    return this.http.get(`/${this.emailVerificationEndpoint}/${userId}`, verifyData as any);
  }

  public resend() {
    return this.http.get(`/${this.emailVerificationResendEndpoint}`);
  }

}
