import { TestBed } from "@angular/core/testing";

import { FormUtilitiesService } from "./form-utilities.service";

describe("FormUtilitiesService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: FormUtilitiesService = TestBed.get(FormUtilitiesService);
    expect(service).toBeTruthy();
  });
});
