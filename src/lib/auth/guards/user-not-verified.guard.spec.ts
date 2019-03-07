import { TestBed, async, inject } from "@angular/core/testing";

import { UserNotVerifiedGuard } from "./user-not-verified.guard";

describe("UserNotVerifiedGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserNotVerifiedGuard]
    });
  });

  it("should ...", inject([UserNotVerifiedGuard], (guard: UserNotVerifiedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
