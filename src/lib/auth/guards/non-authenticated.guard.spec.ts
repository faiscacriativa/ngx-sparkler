import { TestBed, async, inject } from "@angular/core/testing";

import { NonAuthenticatedGuard } from "./authenticated.guard";

describe("NonAuthenticatedGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NonAuthenticatedGuard]
    });
  });

  it("should ...", inject([NonAuthenticatedGuard], (guard: NonAuthenticatedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
