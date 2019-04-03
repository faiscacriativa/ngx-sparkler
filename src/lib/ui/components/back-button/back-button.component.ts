import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";

import { UrlService } from "../../../core/services/index";

@Component({
  selector: "sprk-back-button",
  templateUrl: "./back-button.component.html"
})
export class BackButtonComponent implements OnInit {

  @Input() public path: string;

  public href: string;

  constructor(
    private location: Location,
    private urlService: UrlService
  ) {

  }

  ngOnInit() {
    this.href = this.path;

    if (
      window.history.length > 0 &&
      this.urlService.previousUrl
    ) {
      this.href = this.urlService.previousUrl;
    }
  }

  public back(event: Event) {
    event.preventDefault();

    if (window.history.length > 0) {
      this.location.back();
    } else {
      this.location.replaceState(this.path);
    }

    return false;
  }

}
