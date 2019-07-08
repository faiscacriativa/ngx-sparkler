import { convertToUTCDate, getUTCTime } from "./utils";

describe("utils", () => {
  describe("convertToUTCDate", () => {
    it ("should convert a Date object to UTC", () => {
      const sample = new Date();

      expect(convertToUTCDate(sample).getTime())
        .toBe(sample.getTime() + sample.getTimezoneOffset() * 60000);
    });
  });

  describe("getUTCTime", () => {
    it ("should get the date as UTC", () => {
      const sample = new Date();

      expect(getUTCTime(sample))
        .toBe(sample.getTime() + sample.getTimezoneOffset() * 60000);
    });
  });
});
