export const FakeLocalStorage = {
  store: { } as any,
  getItem: (key: string): string => {
    return key in FakeLocalStorage.store ? FakeLocalStorage.store[key] : null;
  },
  setItem: (key: string, value: string) => {
    FakeLocalStorage.store[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete FakeLocalStorage.store[key];
  },
  clear: () => {
    FakeLocalStorage.store = { };
  }
};

export function installFakeLocalStorage() {
  return {
    getItemSpy: spyOn(localStorage, "getItem")
      .and.callFake(FakeLocalStorage.getItem),

    setItemSpy: spyOn(localStorage, "setItem")
      .and.callFake(FakeLocalStorage.setItem),

    removeItemSpy: spyOn(localStorage, "removeItem")
      .and.callFake(FakeLocalStorage.removeItem),

    clearSpy: spyOn(localStorage, "clear")
      .and.callFake(FakeLocalStorage.clear)
  };
}
