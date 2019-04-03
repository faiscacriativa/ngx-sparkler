import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { PageNotFoundComponent } from "./components/index";

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [HttpClientModule],
  exports: [
    PageNotFoundComponent,

    HttpClientModule
  ]
})
export class SparklerCoreModule {

}
