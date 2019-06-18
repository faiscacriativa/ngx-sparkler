export const FakeEvent = {
  preventDefault: () => { }
};

export const FakePromise = {
  then: fakeCallbackCaller,
  catch: fakeCallbackCaller,
  finally: fakeCallbackCaller
};

export function fakeCallbackCaller(callback: any): any {
  return callback.apply(this);
}
