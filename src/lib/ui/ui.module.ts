import { NgModule } from "@angular/core";

import { SparklerI18nModule } from "../i18n/index";

import { BackButtonComponent } from "./components/index";
import {
  LOADING_OVERLAY_CLASS_NAME,
  LOADING_OVERLAY_HIDDEN_CLASS_NAME,
  LOADING_OVERLAY_SHOWN_CLASS_NAME,
  LOADING_OVERLAYED_CLASS_NAME
} from "./services/index";

@NgModule({
  declarations: [BackButtonComponent],
  imports: [SparklerI18nModule],
  exports: [BackButtonComponent],
  providers: [
    { provide: LOADING_OVERLAY_CLASS_NAME, useValue: "loading-overlay" },
    { provide: LOADING_OVERLAY_HIDDEN_CLASS_NAME, useValue: "hidden" },
    { provide: LOADING_OVERLAY_SHOWN_CLASS_NAME, useValue: "shown" },
    { provide: LOADING_OVERLAYED_CLASS_NAME, useValue: "overlayed" }
  ]
})
export class SparklerUiModule {

}
