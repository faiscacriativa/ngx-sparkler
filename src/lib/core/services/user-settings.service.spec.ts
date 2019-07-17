import { TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";

import { FakeLocalStorage, installFakeLocalStorage } from "projects/ngx-sparkler/src/testing/fakes";

import { USER_SETTINGS_DEFAULTS, USER_SETTINGS_STORAGE_KEY, UserSettingsService } from "./user-settings.service";

describe("UserSettingsService", () => {
  const savedSettingsStub    = { sidebar: { state: "collapsing" } };
  const userSettingsDefaults = { sidebar: { state: "expanded" } };

  const storageKey = "user_settings";

  let service: UserSettingsService;

  beforeEach(() => {
    installFakeLocalStorage();
  });

  describe("without default values", () => {
    beforeEach(() => {
      FakeLocalStorage.store = { user_settings: JSON.stringify(savedSettingsStub) };
      setupTestingModule();
    });

    describe("get", () => {
      it("should return the option value", () => {
        expect(service.get("sidebar.state")).toBe(savedSettingsStub.sidebar.state);
      });
    });

    describe("get$", () => {
      it("should return a BehaviorSubject", async () => {
        const optionValue = service.get$("sidebar.state");

        expect((optionValue as any)).toEqual(jasmine.any(BehaviorSubject));

        optionValue.subscribe(value => {
          expect(value).toBe(savedSettingsStub.sidebar.state);
        });

        expect(service.get$("sidebar.state")).toEqual(jasmine.any(BehaviorSubject));
      });
    });

    describe("set", () => {
      it("should return a promise", () => {
        const newValue        = "collapsed";
        const optionSetResult = service.set("sidebar.state", newValue);

        expect(optionSetResult).toEqual(jasmine.any(Promise));
      });

      it("should set the option value", () => {
        const newValue  = "collapsed";
        const optionKey = "sidebar.state";
        const optionSetResult = service.set(optionKey, newValue);

        expect(optionSetResult).toEqual(jasmine.any(Promise));

        optionSetResult.then((value) => {
          expect(value).toBe(newValue);
        });

        expect(service.get(optionKey)).toBe(newValue);
      });

      it("should set empty", async () => {
        service.set("sidebar.state", "");

        const optionValue = service.get("sidebar.state");

        expect(optionValue).not.toBe(userSettingsDefaults.sidebar.state);
        expect(optionValue).toBe("");
      });
    });
  });

  describe("with default values", () => {
    beforeEach(() => {
      FakeLocalStorage.store = { };
      setupTestingModule([
        { provide: USER_SETTINGS_DEFAULTS, useValue: userSettingsDefaults }
      ]);
    });

    describe("get", () => {
      it("should return default value", () => {
        expect(service.get("sidebar.state")).toBe(userSettingsDefaults.sidebar.state);
      });

      it("should return default settings", () => {
        expect(service.get("")).toEqual(userSettingsDefaults);
      });
    });

    describe("set", () => {
      it("should set the default value", async () => {
        service.set("sidebar.state", "");

        const optionValue = service.get("sidebar.state");

        expect(optionValue).not.toBe(savedSettingsStub.sidebar.state);
        expect(optionValue).toBe(userSettingsDefaults.sidebar.state);
      });
    });
  });

  function setupTestingModule(providers: any[] = []) {
    providers.push({ provide: USER_SETTINGS_STORAGE_KEY, useValue: storageKey });

    TestBed.configureTestingModule({ providers });

    service = TestBed.get(UserSettingsService);
  }
});
