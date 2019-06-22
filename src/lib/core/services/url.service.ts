import { Injectable } from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UrlService {

  public get currentURL(): any {
    return this._currentURL;
  }

  public get previousURL(): any {
    return this._previousURL;
  }

  private _currentURL: any;
  private _previousURL: any;

  constructor(private router: Router) {
    this._currentURL = this.router.url;

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this._previousURL = this._currentURL === event.url ? null : this._currentURL;
        this._currentURL = event.url;
      });
  }

}
