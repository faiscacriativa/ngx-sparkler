import { TranslateService } from "@ngx-translate/core";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";
import { BsLocaleService } from "ngx-bootstrap/datepicker";

export function SetComponentsLanguageFactory(
  bsLocale: BsLocaleService,
  translate: TranslateService
) {
  return () => new Promise((resolve) => {
    let locale = "en";

    if (translate.currentLang === "pt") {
      locale = "pt-br";
      ptBrLocale.invalidDate = translate.instant("validation.date");

      defineLocale(locale, ptBrLocale);
    }

    bsLocale.use(locale);

    resolve();
  });
}
