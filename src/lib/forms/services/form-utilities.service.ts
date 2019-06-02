import { Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class FormUtilitiesService {

  constructor(private translate: TranslateService) {

  }

  public translateLabels(fields: FormlyFieldConfig[], translateKeyPrefix: string): void {
    fields.forEach((item) => {
      const translationKey = translateKeyPrefix.replace(/\.$/, "") + `.${item.key}`;

      if (item.fieldGroup) {
        this.translateLabels(item.fieldGroup, translateKeyPrefix);
      }

      item.templateOptions.label = this.translate.instant(translationKey);
    });
  }

  public showValidationErrors(fields: FormlyFieldConfig[], errors: any): void {
    const mapFieldGroup = (field: FormlyFieldConfig) => {
      return field.fieldGroup ?
        field.fieldGroup.map((innerField: any) => {
          return { [innerField.key]: innerField.formControl };
        }) :
        { [field.key]: field.formControl };
    };

    const mappedFields = Object.assign.apply({ }, [].concat.apply([], fields.map(mapFieldGroup)));

    errors.forEach((error: any) => {
      if (!mappedFields[error.field]) {
        return;
      }

      if (Array.isArray(error.message)) {
        error.message = error.message.shift();
      }

      mappedFields[error.field].setErrors({ backend: { message: error.message } });
    });
  }

}
