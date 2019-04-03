import { InjectionToken } from "@angular/core";

export const APP_DEFAULT_LANGUAGE = new InjectionToken<string>("Application Default Language");
export const APP_LANGUAGES = new InjectionToken<string | RegExp>("Application Available Languages");
export const LANGUAGE_INITIALIZED = new InjectionToken<Array<() => void>>("Language Initialized Event");
export const LANGUAGE_NAMES = new InjectionToken<{ [key: string]: string }>("Language Selection Values");

export const SPARKLER_I18N_DEFAULTS = [
  { provide: APP_DEFAULT_LANGUAGE, useValue: "en" },
  { provide: APP_LANGUAGES, useValue: new RegExp("(en|pt)", "i") },
  {
    provide: LANGUAGE_NAMES,
    useValue: {
      "language.en": "English",
      "language.pt": "Português"
    }
  }
];
