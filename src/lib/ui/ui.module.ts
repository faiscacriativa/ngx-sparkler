import { NgModule } from "@angular/core";

import {
  LOADING_OVERLAY_CLASS_NAME,
  LOADING_OVERLAY_HIDDEN_CLASS_NAME,
  LOADING_OVERLAYED_CLASS_NAME
} from "./services/loading.service";

@NgModule({
  providers: [
    { provide: LOADING_OVERLAY_CLASS_NAME, useValue: "loading-overlay" },
    { provide: LOADING_OVERLAY_HIDDEN_CLASS_NAME, useValue: "hidden" },
    { provide: LOADING_OVERLAYED_CLASS_NAME, useValue: "overlayed" }
  ]
})
export class SparklerUiModule {

}
