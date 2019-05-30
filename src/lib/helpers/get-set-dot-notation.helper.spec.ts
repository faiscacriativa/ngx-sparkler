import { getSetDotNotation } from "./get-set-dot-notation.helper";

describe("getSetDotNotation helper", () => {
  const objectStub = {
    appName: "My Awesome App",
    author: {
      name: "Awesome Team",
      email: "team@awesome.localhost"
    },
    version: "1.0.0"
  };

  it("should get the testing stub object", () => {
    expect(getSetDotNotation(objectStub)).toBe(objectStub);
  });

  it("should get the appName property", () => {
    expect(getSetDotNotation(objectStub, "appName")).toBe(objectStub.appName);
  });

  it("should get the author.name property", () => {
    expect(getSetDotNotation(objectStub, "author.name")).toBe(objectStub.author.name);
  });

  it("should get osInfo property as undefined", () => {
    expect(getSetDotNotation(objectStub, "osInfo")).toBeUndefined();
  });

  it("should get hardwareInfo.cpu.manufacturer property as undefined", () => {
    expect(getSetDotNotation(objectStub, "hardwareInfo.cpu.manufacturer")).toBeUndefined();
  });

  it("should set author.email property", () => {
    const originalValue = objectStub.author.email;
    const testValue     = "developers@awesomeapp.com";

    getSetDotNotation(objectStub, "author.email", testValue);

    expect(getSetDotNotation(objectStub, "author.email")).not.toBe(originalValue);
    expect(getSetDotNotation(objectStub, "author.email")).toBe(testValue);
  });

  it("should set osInfo property", () => {
    const testValue = "Windows";

    getSetDotNotation(objectStub, "osInfo", testValue);

    expect(getSetDotNotation(objectStub, "osInfo")).toBe(testValue);
  });

  it("should set hardwareInfo.cpu.manufacturer property", () => {
    const testValue = "Intel";

    getSetDotNotation(objectStub, "hardwareInfo.cpu.manufacturer", testValue);

    expect(getSetDotNotation(objectStub, "hardwareInfo.cpu.manufacturer")).toBe(testValue);
  });
});
