import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { FieldWrapper } from "@ngx-formly/core";

@Component({
  selector: "sprk-horizontal",
  templateUrl: "./horizontal.component.html"
})
export class FormlyHorizontalComponent extends FieldWrapper {

  @ViewChild("fieldComponent", { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

}
