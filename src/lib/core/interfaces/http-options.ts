import { HttpHeaders, HttpParams } from "@angular/common/http";

import { HttpObserve, ResponseType } from "../services/index";

export interface HttpOptions {

  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: HttpObserve;
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  responseType?: ResponseType;
  withCredentials?: boolean;

}
