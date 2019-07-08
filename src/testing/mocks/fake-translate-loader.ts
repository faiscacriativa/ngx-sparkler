import { TranslateLoader } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

// tslint:disable:object-literal-key-quotes
export const translationsStub: any = {
  "en": "English",
  "TEST": "This is a test"
};

export class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of(translationsStub);
  }
}
