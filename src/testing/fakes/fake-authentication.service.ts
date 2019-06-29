import { BehaviorSubject, of } from "rxjs";

export const FakeAuthenticationService = {
  accessToken: undefined,
  isAuthenticated: new BehaviorSubject<boolean>(false),
  isVerified: new BehaviorSubject<boolean>(false),
  logout: () => {
    FakeAuthenticationService.accessToken = undefined;
    return of({ message: "Ok." });
  },
  refreshAccessToken: () => { }
};
