import { TestBed } from "@angular/core/testing";
import { TranslateService } from "@ngx-translate/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

import { lineFeedRegEx } from "../../helpers";

import { DialogService } from "./dialog.service";

describe("DialogService", () => {
  const confirmOptionsDefaults: SweetAlertOptions = {
    titleText         : "ui.dialog.confirmTitle",
    type              : "question",
    allowOutsideClick : false,
    showCancelButton  : true,
    confirmButtonText : "ui.dialog.yes",
    cancelButtonText  : "ui.dialog.no"
  };

  const errorOptionsDefaults: SweetAlertOptions = {
    titleText : "ui.dialog.title.error",
    type      : "error"
  };

  const successOptionsDefaults: SweetAlertOptions = {
    titleText : "ui.dialog.title.success",
    type      : "success"
  };

  const warningOptionsDefaults: SweetAlertOptions = {
    titleText : "ui.dialog.title.warning",
    type      : "warning"
  };

  let service: DialogService;
  let translateServiceStub: Partial<TranslateService>;

  beforeEach(() => {
    translateServiceStub = { instant: (key) => key };

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceStub }
      ]
    });

    service = TestBed.get(DialogService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should create confirm dialog", (done: DoneFn) => {
    const message = "I'm a test confirm dialog!\nYou confirm me?";

    const options: SweetAlertOptions = {
      ...confirmOptionsDefaults,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.confirm(message)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create confirm dialog with a custom title", (done: DoneFn) => {
    const title   = "THE title";
    const message = "I'm a test confirm with custom dialog!\nYou confirm me?";

    const options: SweetAlertOptions = {
      ...confirmOptionsDefaults,
      titleText: title,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.confirm(message, title)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create confirm dialog with custom options", (done: DoneFn) => {
    const message = "I'm a test confirm with custom options!\nConfirm me?";

    const options: SweetAlertOptions = {
      ...confirmOptionsDefaults,
      titleText: "Mambo Jambo!",
      html: message.replace(lineFeedRegEx, "<br>"),
      showCancelButton: false,
      confirmButtonText: "YEAH!"
    };

    const wrongOptions: SweetAlertOptions = {
      ...options,
      html: "Another text.",
      titleText: "Hijacked, perhaps?"
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.confirm(message, options)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(Swal.fire).not.toHaveBeenCalledWith(wrongOptions);

        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create error dialog", (done: DoneFn) => {
    const message = "I'm an error dialog.\nFear me!";

    const options: SweetAlertOptions = {
      ...errorOptionsDefaults,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.error(message)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create error dialog with a custom title", (done: DoneFn) => {
    const title   = "FEAR ME!!!";
    const message = "Something bad happened!\nTry again later.";

    const options: SweetAlertOptions = {
      ...errorOptionsDefaults,
      titleText: title,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.error(message, title)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create error dialog with custom options", (done: DoneFn) => {
    const message = "It works at my machine.\nGo figures?";

    const options: SweetAlertOptions = {
      ...errorOptionsDefaults,
      titleText: "Holey Mullah!",
      html: message.replace(lineFeedRegEx, "<br>"),
      showCancelButton: false,
      confirmButtonText: "Oh, no!"
    };

    const wrongOptions: SweetAlertOptions = {
      ...options,
      html: "Wanna cry?",
      titleText: "P@wn3d!"
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.error(message, options)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(Swal.fire).not.toHaveBeenCalledWith(wrongOptions);

        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create success dialog", (done: DoneFn) => {
    const message = "I'm a test success dialog!\nDo you hear me?";

    const options: SweetAlertOptions = {
      ...successOptionsDefaults,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.success(message)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create success dialog with a custom title", (done: DoneFn) => {
    const title   = "We are the champions!";
    const message = "We've made it.\nCall everybody!";

    const options: SweetAlertOptions = {
      ...successOptionsDefaults,
      titleText: title,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.success(message, title)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create success dialog with custom options", (done: DoneFn) => {
    const message = "We've done a greate work.\nLet's get the party started!";

    const options: SweetAlertOptions = {
      ...successOptionsDefaults,
      titleText: "Unstoppable!",
      html: message.replace(lineFeedRegEx, "<br>"),
      showCancelButton: false,
      confirmButtonText: "OOOOOH!"
    };

    const wrongOptions: SweetAlertOptions = {
      ...options,
      html: "You know you're not right.",
      titleText: "Copycat?"
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.success(message, options)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(Swal.fire).not.toHaveBeenCalledWith(wrongOptions);

        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create warning dialog", (done: DoneFn) => {
    const message = "I'm a test warning dialog!\nLet's get out of here!";

    const options: SweetAlertOptions = {
      ...warningOptionsDefaults,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.warning(message)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create warning dialog with a custom title", (done: DoneFn) => {
    const title   = "It's catching fire, bug!";
    const message = "Call the firemen!\nYou'll need to call them!";

    const options: SweetAlertOptions = {
      ...warningOptionsDefaults,
      titleText: title,
      html: message.replace(lineFeedRegEx, "<br>")
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.warning(message, title)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(result).toBe(resultStub);

        done();
      });
  });

  it("should create warning dialog with custom options", (done: DoneFn) => {
    const message = "Call the firemen!\nIt's catching fire, bug!";

    const options: SweetAlertOptions = {
      ...warningOptionsDefaults,
      titleText: "Press number one, turns on!",
      html: message.replace(lineFeedRegEx, "<br>"),
      showCancelButton: false,
      confirmButtonText: "POOF!"
    };

    const wrongOptions: SweetAlertOptions = {
      ...options,
      html: "Tell them that was an accident.",
      titleText: "Fire? What fire?"
    };

    const resultStub: SweetAlertResult = { value: "" };

    spyOn(Swal, "fire").and.returnValue(Promise.resolve(resultStub));

    service.warning(message, options)
      .then((result: SweetAlertResult) => {
        expect(Swal.fire).toHaveBeenCalledWith(options);
        expect(Swal.fire).not.toHaveBeenCalledWith(wrongOptions);

        expect(result).toBe(resultStub);

        done();
      });
  });

  // Todo: Expand the tests to validate the SweetAlert results.
});
