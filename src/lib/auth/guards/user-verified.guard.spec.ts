import { TestBed, async, inject } from "@angular/core/testing";

import { UserVerifiedGuard } from "./user-verified.guard";

describe("UserVerifiedGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserVerifiedGuard]
    });
  });

  it("should ...", inject([UserVerifiedGuard], (guard: UserVerifiedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
