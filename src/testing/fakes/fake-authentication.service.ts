import { BehaviorSubject, of } from "rxjs";

import { Profile, User } from "../../lib/auth";

export const FakeAuthenticationService = {
  accessToken: undefined,
  fetchUser: () => {
    const userStub = { id: 1, email: "user@email" } as User;
    FakeAuthenticationService.user.next(userStub);
    return of(userStub);
  },
  isAuthenticated: new BehaviorSubject<boolean>(false),
  isVerified: new BehaviorSubject<boolean>(false),
  logout: () => {
    FakeAuthenticationService.accessToken = undefined;
    return of({ message: "Ok." });
  },
  refreshAccessToken: () => { },
  user: new BehaviorSubject<User>({ profile: { first_name: "Guest" } as Profile } as User)
};
