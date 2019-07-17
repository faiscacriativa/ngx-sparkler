import { Injectable, InjectionToken, Injector } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { getSetDotNotation } from "../../helpers/get-set-dot-notation.helper";

export const USER_SETTINGS_STORAGE_KEY = new InjectionToken<string>("User settings key in the storage");
export const USER_SETTINGS_DEFAULTS    = new InjectionToken<any>("User settings default values");

@Injectable({
  providedIn: "root"
})
export class UserSettingsService {

  public options$: BehaviorSubject<any>;

  private _options: any;
  private _optionsSubjects: Map<string, BehaviorSubject<any>>;

  private defaults: any = { };
  private storageKey: string;

  constructor(injector: Injector) {
    this.defaults = injector.get(USER_SETTINGS_DEFAULTS, { });
    this.storageKey = injector.get(USER_SETTINGS_STORAGE_KEY, "user_settings");

    this._options = this.load();
    this._optionsSubjects = new Map<string, BehaviorSubject<any>>();

    this.options$ = new BehaviorSubject(this._options);
  }

  public get(option?: string): any {
    return getSetDotNotation(this._options, option);
  }

  public get$(option?: string): BehaviorSubject<any> {
    if (this._optionsSubjects.has(option)) {
      return this._optionsSubjects.get(option);
    }

    const optionValue   = this.get(option);
    const optionSubject = new BehaviorSubject(optionValue);

    this._optionsSubjects.set(option, optionSubject);

    return optionSubject;
  }

  public set(option: string, newValue: any): Promise<any> {
    if (!newValue) {
      const defaultValue = getSetDotNotation(this.defaults, option);

      if (defaultValue) {
        newValue = defaultValue;
      }
    }

    getSetDotNotation(this._options, option, newValue);

    return this.persist().then(() => {
      /* istanbul ignore next */
      if (this._optionsSubjects.has(option)) {
        this._optionsSubjects.get(option).next(newValue);
      }

      this.options$.next(this._options);

      return newValue;
    });
  }

  private load(): any {
    const payload = JSON.parse(localStorage.getItem(this.storageKey));

    return payload ? payload : JSON.parse(JSON.stringify(this.defaults));
  }

  private persist(): Promise<void> {
    return new Promise((resolve) => {
      const payload = JSON.stringify(this._options);

      localStorage.setItem(this.storageKey, payload);

      resolve();
    });
  }

}
