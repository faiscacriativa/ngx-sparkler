import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { SparklerCoreModule } from "../core.module";
import { HttpService, API_URL } from './http.service';
import { HttpResponse } from '@angular/common/http';
import { HttpOptions } from '../interfaces';

describe("HttpService", () => {
  let apiUrl: string;
  let http: HttpService;
  let httpController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SparklerCoreModule
      ],
      providers: [{ provide: API_URL, useValue: "http://localhost:8000" }]
    });
  }));

  beforeEach(() => {
    apiUrl         = TestBed.get(API_URL);
    http           = TestBed.get(HttpService);
    httpController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe("delete", () => {
    it("should execute without query data", () => {
      http.delete("/file", null)
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with query data", () => {
      http.delete("/file", { dategt: "2019-05-19" })
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file?dategt=2019-05-19`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with options", () => {
      const options: HttpOptions = {
        params: { dategt: "2019-05-19" },
        observe: "response"
      };

      http.delete("/file", undefined, options)
        .subscribe((response: HttpResponse<string>) => {
          expect(response.body).toBe("Ok.");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("Ok");
        });

      httpController.expectOne(`${apiUrl}/file?dategt=2019-05-19`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });
  });

  describe("get", () => {
    it("should execute without query data", () => {
      http.get("/file", null)
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with query data", () => {
      http.get("/file", { dategt: "2019-05-19" })
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file?dategt=2019-05-19`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with options", () => {
      const options: HttpOptions = {
        params: { dategt: "2019-05-19" },
        observe: "response"
      };

      http.get("/file", undefined, options)
        .subscribe((response: HttpResponse<string>) => {
          expect(response.body).toBe("Ok.");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("Ok");
        });

      httpController.expectOne(`${apiUrl}/file?dategt=2019-05-19`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });
  });

  describe("head", () => {
    it("should execute without query data", () => {
      http.head("/file", null)
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with query data", () => {
      http.head("/file", { dategt: "2019-05-19" })
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file?dategt=2019-05-19`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with options", () => {
      const options: HttpOptions = {
        params: { dategt: "2019-05-19" },
        observe: "response"
      };

      http.head("/file", undefined, options)
        .subscribe((response: HttpResponse<string>) => {
          expect(response.body).toBe("Ok.");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("Ok");
        });

      httpController.expectOne(`${apiUrl}/file?dategt=2019-05-19`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });
  });

  describe("patch", () => {
    it("should execute without body", () => {
      http.patch("/file", null)
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with body", () => {
      http.patch("/file", { dategt: "2019-05-19" })
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with options", () => {
      const options: HttpOptions = { observe: "response" };

      http.patch("/file", undefined, options)
        .subscribe((response: HttpResponse<string>) => {
          expect(response.body).toBe("Ok.");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("Ok");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });
  });

  describe("post", () => {
    it("should execute without body", () => {
      http.post("/file", null)
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with body", () => {
      http.post("/file", { dategt: "2019-05-19" })
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with options", () => {
      const options: HttpOptions = { observe: "response" };

      http.post("/file", undefined, options)
        .subscribe((response: HttpResponse<string>) => {
          expect(response.body).toBe("Ok.");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("Ok");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });
  });

  describe("put", () => {
    it("should execute without body", () => {
      http.put("/file", null)
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with body", () => {
      http.put("/file", { dategt: "2019-05-19" })
        .subscribe((response: string) => {
          expect(response).toBe("Ok.");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });

    it("should execute with options", () => {
      const options: HttpOptions = { observe: "response" };

      http.put("/file", undefined, options)
        .subscribe((response: HttpResponse<string>) => {
          expect(response.body).toBe("Ok.");
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("Ok");
        });

      httpController.expectOne(`${apiUrl}/file`)
        .flush("Ok.", { status: 200, statusText: "Ok" });
    });
  });
});
