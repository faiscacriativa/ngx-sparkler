/**
 * @license
 * Copyright Faísca Criativa. All Rights Reserved.
 *
 * The use of this source code is governed by an MIT-style license that can be
 * found in LICENSE file or at http://faiscacriativa.com.br/sparkler/license.
 */

import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

import { HttpOptions } from "../interfaces/index";

export const API_URL = new InjectionToken<string>("API URL");

export type HttpObserve = "body" | "events" | "response";
export type ResponseType = "arraybuffer" | "blob" | "json" | "text";

/**
 * Peforms HTTP requests.
 *
 * `HttpService` simplifies some of methods signatures from `HttpClient`.
 * Each request method has multiple signatures, and the return type varies
 * according to which signature is called (mainly the values of `observe` and `responseType`).
 *
 * For more details see the `HttpClient` implementation.
 *
 * @publicApi
 */
@Injectable({
  providedIn: "root"
})
export class HttpService {

  private apiUrl: string;

  constructor(@Inject(API_URL) apiUrl: string, private http: HttpClient) {
    this.apiUrl = apiUrl.replace(/\/$/, "");
  }

  /**
   * Constructs an `Observable` which, when subscribed, will cause the configured
   * DELETE request to be executed on the server. See the individual overloads for
   * details of `delete()`'s return type based on the provided options.
   */
  delete(
    endpoint: string,
    queryData: HttpParams | { [param: string]: string | string[] } = { },
    options: HttpOptions = { }
  ): Observable<any> {
    if (queryData) {
      if (!options.params) {
        options.params = new HttpParams();
      }

      for (const param in queryData) {
        /* istanbul ignore next */
        if (!queryData.hasOwnProperty(param)) { continue; }
        options.params = (options.params as HttpParams).append(param, queryData[param]);
      }
    }

    return this.http.delete(this.apiUrl + endpoint, options as any);
  }

  /**
   * Constructs an observable that, when subscribed, causes the configured
   * `GET` request to execute on the server. See the individual overloads for
   * details on the return type.
   */
  get(
    endpoint: string,
    queryData: HttpParams | { [param: string]: string | string[] } = { },
    options: HttpOptions = { }
  ): Observable<any> {
    if (queryData) {
      if (!options.params) {
        options.params = new HttpParams();
      }

      for (const param in queryData) {
        /* istanbul ignore next */
        if (!queryData.hasOwnProperty(param)) { continue; }
        options.params = (options.params as HttpParams).append(param, queryData[param]);
      }
    }

    return this.http.get(this.apiUrl + endpoint, options as any);
  }

  /**
   * Constructs an `Observable` which, when subscribed, will cause the configured
   * HEAD request to be executed on the server. See the individual overloads for
   * details of `head()`'s return type based on the provided options.
   */
  public head(
    endpoint: string,
    queryData: HttpParams | { [param: string]: any | any[] } = { },
    options: HttpOptions = { }
  ): Observable<any> {
    if (queryData) {
      if (!options.params) {
        options.params = new HttpParams();
      }

      for (const param in queryData) {
        /* istanbul ignore next */
        if (!queryData.hasOwnProperty(param)) { continue; }
        options.params = (options.params as HttpParams).append(param, queryData[param]);
      }
    }

    return this.http.head(this.apiUrl + endpoint, options as any);
  }

  /**
   * Constructs an `Observable` which, when subscribed, will cause the configured
   * PATCH request to be executed on the server. See the individual overloads for
   * details of `patch()`'s return type based on the provided options.
   */
  patch(endpoint: string, body: any | null, options: HttpOptions = { }): Observable<any> {
    return this.http.patch(this.apiUrl + endpoint, body, options as any);
  }

  /**
   * Constructs an `Observable` which, when subscribed, will cause the configured
   * POST request to be executed on the server. See the individual overloads for
   * details of `post()`'s return type based on the provided options.
   */
  post(endpoint: string, body: any | null, options: HttpOptions = { }): Observable<any> {
    return this.http.post(this.apiUrl + endpoint, body, options as any);
  }

  /**
   * Constructs an `Observable` which, when subscribed, will cause the configured
   * PUT request to be executed on the server. See the individual overloads for
   * details of `put()`'s return type based on the provided options.
   */
  put(endpoint: string, body: any | null, options: HttpOptions = { }): Observable<any> {
    return this.http.put(this.apiUrl + endpoint, body, options as any);
  }

}
