import { NgModule } from "@angular/core";

import { SparklerI18nModule } from "../i18n/index";

import { BackButtonComponent } from "./components/index";
import { SPARKLER_UI_DEFAULTS } from "./injection-tokens";

@NgModule({
  declarations: [BackButtonComponent],
  imports: [SparklerI18nModule],
  exports: [BackButtonComponent],
  providers: [SPARKLER_UI_DEFAULTS]
})
export class SparklerUiModule {

}
