import { FormlyConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";

export function ValidationMessagesTranslationFactory(
  formlyConfig: FormlyConfig,
  translate: TranslateService
) {
  return () => new Promise((resolve: any) => {
    const config = {
      validationMessages: [
        { name: "email", message: translate.instant("validation.email") },
        { name: "required", message: translate.instant("validation.required") },
        {
          name: "maxlength",
          message: (error: any) => translate.instant(
            "validation.maxlength",
            { chars: error.actualLength - error.requiredLength }
          )
        },
        {
          name: "minlength",
          message: (error: any) => translate.instant(
            "validation.minLength",
            { charsLeft: error.requiredLength - error.actualLength }
          )
        },
        { name: "pattern", message: translate.instant("validation.pattern") },
        { name: "telephone", message: translate.instant("validation.telephone") }
      ]
    };

    formlyConfig.addConfig(config);

    resolve();
  });
}
