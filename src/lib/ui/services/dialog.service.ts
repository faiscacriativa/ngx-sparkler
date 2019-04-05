import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

// tslint:disable unified-signatures

@Injectable({
  providedIn: "root"
})
export class DialogService {

  constructor(private translate: TranslateService) {

  }

  public confirm(message: string, title?: string): Promise<SweetAlertResult>;
  public confirm(message: string, config?: SweetAlertOptions): Promise<SweetAlertResult>;
  public confirm(message: string, config: any): Promise<SweetAlertResult> {
    if (config instanceof String) {
      config = { titleText: config };
    }

    const options = Object.assign(
      {
        titleText: this.translate.instant("ui.dialog.confirmTitle"),
        html: message.replace(/\\n*/ig, "<br>"),
        type: "question",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant("ui.dialog.yes"),
        cancelButtonText: this.translate.instant("ui.dialog.no")
      },
      config
    );

    return Swal.fire(options);
  }

  public error(message: string, title?: string): Promise<SweetAlertResult>;
  public error(message: string, config?: SweetAlertOptions): Promise<SweetAlertResult>;
  public error(message: string, config: any): Promise<SweetAlertResult> {
    if (config instanceof String) {
      config = { titleText: config };
    }

    const options = Object.assign(
      {
        titleText: this.translate.instant("ui.dialog.title.error"),
        html: message.replace(/\\n*/ig, "<br>"),
        type: "error"
      },
      config
    );

    return Swal.fire(options);
  }

  public success(message: string, title?: string): Promise<SweetAlertResult>;
  public success(message: string, config?: SweetAlertOptions): Promise<SweetAlertResult>;
  public success(message: string, config: any): Promise<SweetAlertResult> {
    if (config instanceof String) {
      config = { titleText: config };
    }

    const options = Object.assign(
      {
        titleText: this.translate.instant("ui.dialog.title.success"),
        html: message.replace(/\\n*/ig, "<br>"),
        type: "success"
      },
      config
    );

    return Swal.fire(options);
  }

  public warning(message: string, title?: string): Promise<SweetAlertResult>;
  public warning(message: string, config?: SweetAlertOptions): Promise<SweetAlertResult>;
  public warning(message: string, config: any): Promise<SweetAlertResult> {
    if (config instanceof String) {
      config = { titleText: config };
    }

    const options = Object.assign(
      {
        titleText: this.translate.instant("ui.dialog.title.warning"),
        html: message.replace(/\\n*/ig, "<br>"),
        type: "warning"
      },
      config
    );

    return Swal.fire(options);
  }

}
