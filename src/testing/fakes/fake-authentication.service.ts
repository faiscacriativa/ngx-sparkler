import { BehaviorSubject } from "rxjs";

export const FakeAuthenticationService = {
  isAuthenticated: new BehaviorSubject<boolean>(false)
};
