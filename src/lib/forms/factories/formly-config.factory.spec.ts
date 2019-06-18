import { TestBed, async } from "@angular/core/testing";
import { FormlyConfig } from "@ngx-formly/core";

import { FormlyConfigFactory } from "./formly-config.factory";

describe("FormlyConfigFactory", () => {
  let formlyConfig: FormlyConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ });

    formlyConfig = TestBed.get(FormlyConfig);
  }));

  it("should configure Formly", async () => {
    const spy = spyOn(formlyConfig, "addConfig");

    await FormlyConfigFactory(formlyConfig).apply(this);

    expect(spy).toHaveBeenCalled();
  });
});
