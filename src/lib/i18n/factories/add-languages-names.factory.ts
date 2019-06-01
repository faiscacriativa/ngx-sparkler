import { TranslateService } from "@ngx-translate/core";

export function AddLanguagesNamesFactory(
  languageNames: { [key: string]: string },
  translate: TranslateService
) {
  return () => new Promise<void>((resolve: any) => {
    translate.getLangs()
      .forEach((language: string) => {
        translate.setTranslation(language, languageNames, true);
      });

    resolve();
  });
}
