import { FormlyConfig } from "@ngx-formly/core";

import { SPARKLER_FORMLY_CONFIG } from "../formly.config";

export function FormlyConfigFactory(formlyConfig: FormlyConfig) {
  return () => new Promise((resolve) => {
    formlyConfig.addConfig(SPARKLER_FORMLY_CONFIG)
    resolve();
  });
}
