import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

// import { DialogService, LoadingService } from "@sparkler/ngx-ui";

import { ApiResponse } from "../interfaces/api-response";
import { HttpService } from "../services/http.service";

export abstract class DataProvider<T> {

  protected endpoint: string;
  protected idField = "id";

  constructor(
    // private dialog: DialogService,
    private http: HttpService,
    // private loading: LoadingService
  ) {
  }

  // public delete(data: T): Promise<Boolean> {
  //   return new Promise((resolve, reject) => {
  //     const confirmText = this.getDeleteConfirmText(data);

  //     this.dialog.confirm(confirmText)
  //       .then((reason) => {
  //         if (reason.dismiss) {
  //           return reject(true);
  //         }

  //         const id = data[this.idField];

  //         this.loading.show();

  //         this.http.delete(`${this.endpoint}/${id}`)
  //           .pipe(tap(
  //             () => this.loading.hide(),
  //             () => this.loading.hide()
  //           ))
  //           .subscribe(
  //             () => resolve(false),
  //             () => reject(false)
  //           );
  //       });
  //   });
  // }

  public delete(data: T): Observable<boolean> {
    const id = data[this.idField];

    return this.http.delete(`${this.endpoint}/${id}`)
      .pipe(map((response: ApiResponse) => response.data));
  }

  public get(id: any): Observable<T> {
    return this.http.get(`${this.endpoint}/${id}`)
      .pipe(map((response: ApiResponse) => response.data));
  }

  public list(): Observable<T[]> {
    return this.http.get(this.endpoint)
      .pipe(map((response: ApiResponse) => response.data));
  }

  public store(data: T): Observable<T> {
    return this.http.post(this.endpoint, data)
      .pipe(map((response: ApiResponse) => response.data));
  }

  public update(id: any, data: T): Observable<T> {
    return this.http.put(`${this.endpoint}/${id}`, data)
      .pipe(map((response: ApiResponse) => response.data));
  }

  public patch(id: any, data: T): Observable<T> {
    return this.http.patch(`${this.endpoint}/${id}`, data)
      .pipe(map((response: ApiResponse) => response.data));
  }

  // protected abstract getDeleteConfirmText(data: T): string;

}
