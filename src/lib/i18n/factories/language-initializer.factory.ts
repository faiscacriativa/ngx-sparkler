import { LOCATION_INITIALIZED } from "@angular/common";
import { Injector, isDevMode } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";

import { DialogService } from "../../ui/index";

import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES, LANGUAGE_INITIALIZED } from "../injection-tokens";

function initializeLanguage(
  listeners: any,
  languageSet: string,
  callback?: (languageSet: string) => void
) {
  const initializationPromises: Promise<any>[] = [];

  if (listeners) {
    for (const initializationListener of listeners) {
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
      callback.apply(this, [languageSet]);
    }

    return;
  }

  Promise.all(initializationPromises)
    .then(() => {
      if (callback) {
        callback.apply(this, [languageSet]);
      }
    });
}

export function LanguageInitializerFactory(
  dialog: DialogService,
  injector: Injector,
  translate: TranslateService
) {
  return () => new Promise<void>((resolve: any, reject: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    const availableLanguages = injector.get(APP_LANGUAGES);
    const defaultLanguage = injector.get(APP_DEFAULT_LANGUAGE);
    const initializationListeners: (() => any)[] = injector.get<Array<() => any>>(LANGUAGE_INITIALIZED, []);

    locationInitialized.then(() => {
      const browserLanguage: string = translate.getBrowserLang();
      let languageToSet = browserLanguage.match(availableLanguages) ? browserLanguage : defaultLanguage;

      translate.setDefaultLang(defaultLanguage);
      translate.use(languageToSet)
        .pipe(
          catchError(() => {
            if (isDevMode()) {
              console.error(`Problems with '${languageToSet}' language initialization.`);
            }

            languageToSet = defaultLanguage;

            return translate.use(defaultLanguage)
              .pipe(catchError(() => {
                if (isDevMode()) {
                  console.error(`Problems with '${languageToSet}' language initialization.`);
                  console.error("No languages available to be set.");
                }

                dialog.error(
                  "Failed to load language.\nFalha ao carregar a linguagem.",
                  {
                    titleText: null,
                    showConfirmButton: false,
                    allowOutsideClick: false
                  }
                );

                reject();

                return EMPTY;
              }));
          }))
        .subscribe(() => {
          initializeLanguage(
            initializationListeners,
            languageToSet,
            (languageSet) => {
              if (isDevMode()) {
                console.log(`Language '${languageSet}' initialized successfully.`);
              }
            }
          );

          resolve();
        });
    });
  });
}
