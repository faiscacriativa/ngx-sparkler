import { TestBed } from "@angular/core/testing";
import { FormlyConfig } from "@ngx-formly/core";

import { FormlyConfigFactory } from "./formly-config.factory";

describe("FormlyConfigFactory", () => {
  let formlyConfig: FormlyConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: []
    });

    formlyConfig = TestBed.get(FormlyConfig);
  });

  it("should configure Formly", (done: DoneFn) => {
    const spy = spyOn(formlyConfig, "addConfig");

    FormlyConfigFactory(formlyConfig)
      .apply(this)
      .then(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
  });
});
