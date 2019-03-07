import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function TranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const TRANSLATE_LOADER_PROVIDER = {
  provide: TranslateLoader,
  useFactory: TranslateLoaderFactory,
  deps: [HttpClient]
};
