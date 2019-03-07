import { LOCATION_INITIALIZED } from "@angular/common";
import { Injector, isDevMode } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { APP_LANGUAGES, APP_DEFAULT_LANGUAGE, LANGUAGE_INITIALIZED } from "../injection-tokens";

export function LanguageInitializerFactory(
  injector: Injector,
  translate: TranslateService
) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    const availableLanguages = injector.get(APP_LANGUAGES);
    const defaultLanguage = injector.get(APP_DEFAULT_LANGUAGE);
    const languageInitializationListeners: (() => any)[] = injector.get(LANGUAGE_INITIALIZED);
    const initialize = (languageToSet: string, callback?: (languageToSet: string) => void) => {
      const initializationPromises: Promise<any>[] = [];

      if (languageInitializationListeners) {
        for (const initializationListener of languageInitializationListeners) {
          if (typeof initializationListener !== "function") {
            continue;
          }

          const initializationResult = initializationListener();

          if (!!initializationResult && typeof initializationResult.then === "function") {
            initializationPromises.push(initializationResult);
          }
        }
      }

      if (initializationPromises.length === 0) {
        if (callback) {
          callback.apply(this, [languageToSet]);
        }

        return;
      }

      Promise.all(initializationPromises)
        .then(() => {
          if (callback) {
            callback.apply(this, [languageToSet]);
          }
        });
    };
    const completed = (languageToSet: string) => {
      if (isDevMode()) {
        console.log(`Language '${languageToSet}' initialized successfully.`);
      }

      resolve();
    };

    locationInitialized.then(() => {
      const browserLanguage: string = translate.getBrowserLang();
      const languageToSet = browserLanguage.match(availableLanguages) ? browserLanguage : defaultLanguage;

      translate.setDefaultLang(defaultLanguage);
      translate.use(languageToSet)
        .subscribe(
          () => {
            initialize(languageToSet, completed);
          },
          () => {
            initialize(languageToSet);

            if (isDevMode()) {
              console.log(`Problems with '${languageToSet}' language initialization.`);
              resolve();
            }
          }
        );
    });
  });
}
