import { Component, OnInit, ViewChild } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { BsDatepickerConfig, BsDaterangepickerDirective } from "ngx-bootstrap/datepicker";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "formly-field-datepicker",
  templateUrl: "./datepicker.component.html"
})
export class DatepickerComponent extends FieldType implements OnInit {

  @ViewChild("datepicker") datepicker: BsDaterangepickerDirective;

  public bsConfig: Partial<BsDatepickerConfig>;

  ngOnInit(): void {
    this.bsConfig = Object.assign({ }, { containerClass: this.to.datepicker.containerClass });
    this.datepicker.setConfig();
  }

}
