import { TranslateLoader } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

// tslint:disable:object-literal-key-quotes
export const translationsStub: any = {
  "en": "English",
  "testForm": {
    "fullName": "Full name",
    "firstName": "First name",
    "lastName": "Last name",
    "email": "E-mail"
  }
};

export class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of(translationsStub);
  }
}
