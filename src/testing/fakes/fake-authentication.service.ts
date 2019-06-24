import { BehaviorSubject } from "rxjs";

export const FakeAuthenticationService = {
  accessToken: undefined,
  isAuthenticated: new BehaviorSubject<boolean>(false),
  isVerified: new BehaviorSubject<boolean>(false)
};
