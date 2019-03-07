import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [HttpClientModule],
  exports: [
    HttpClientModule,

    PageNotFoundComponent
  ]
})
export class SparklerCoreModule {

}
