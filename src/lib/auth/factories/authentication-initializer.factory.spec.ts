import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { User } from "../interfaces";
import { AuthenticationService } from "../services";

import { AuthenticationInitializerFactory } from "./authentication-initializer.factory";

describe("AuthenticationInitializerFactory", () => {
  const userMock: Partial<User> = {
    id: 1,
    email: "username@provider"
  };

  let authenticationServiceStub: Partial<AuthenticationService>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    authenticationServiceStub = jasmine.createSpyObj("AuthenticationService", ["fetchUser"]);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceStub }
      ]
    });

    authenticationServiceSpy = TestBed.get(AuthenticationService);
    authenticationServiceSpy.fetchUser.and.returnValue(of(userMock));
  });

  it("should fetch the current authenticated user", (done: DoneFn) => {
    const injector = TestBed.get(Injector);

    AuthenticationInitializerFactory(injector)
      .apply(this)
      .then((user: User) => {
        expect(user).toBe(userMock as User);
        done();
      });
  });
});
