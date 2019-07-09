import {
  dateValidator,
  emailValidator,
  telephoneValidator,
  valueMatchValidator
} from "./validators";

describe("validators", () => {
  describe("date validator", () => {
    it("should validate english date formats", () => {
      expect(dateValidator("02/31/1989", "MM/DD/YYYY")).toBe(false);
      expect(dateValidator("12/31/1989", "MM/DD/YYYY")).toBe(true);
    });

    it("should validate brazilian date formats", () => {
      expect(dateValidator("31/12/1989", "DD/MM/YYYY")).toBe(true);
      expect(dateValidator("31/02/1989", "DD/MM/YYYY")).toBe(false);
    });
  });

  describe("email validator", () => {
    it("should return true", () => {
      expect(emailValidator("user@provider.co")).toBe(true);
    });

    it("should return false", () => {
      expect(emailValidator("user.@provider")).toBe(false);
    });
  });

  describe("telphone validator", () => {
    it("should validate Brazil telephone format with USA country form", () => {
      expect(telephoneValidator("+1 021 9 7474-5832")).toBe(false);
    });

    it("should validate brazilian 8 digit telephone format", () => {
      expect(telephoneValidator("7474-5832")).toBe(false);
    });

    it("should validate brazilian 9 digit format with land and country code", () => {
      expect(telephoneValidator("+55 021 9 7474-5832")).toBe(true);
    });

    it("should validate USA telephone format with USA country code", () => {
      expect(telephoneValidator("+1 541-754-3010")).toBe(true);
    });

    it("should validate USA telephone with Brazil country code format", () => {
      expect(telephoneValidator("+55 541-754-3010")).toBe(false);
    });
  });

  describe("value match validator", () => {
    it("should return true (cat === cat)", () => {
      expect(valueMatchValidator("cat", "cat")).toBe(true);
    });

    it("should return false (cat === dog)", () => {
      expect(valueMatchValidator("cat", "dog")).toBe(false);
    });

    it("should return false (null === undefined)", () => {
      expect(valueMatchValidator(null, undefined)).toBe(false);
    });

    it("should return false (dog === null)", () => {
      expect(valueMatchValidator("dog", null));
    });

    it("should return true (10 === 10)", () => {
      expect(valueMatchValidator(10, 10)).toBe(true);
    });

    it("should return false (10 === 100)", () => {
      expect(valueMatchValidator(10, 100)).toBe(false);
    });

    it("should return true (0 === 0)", () => {
      expect(valueMatchValidator(0, 0)).toBe(true);
    });

    it("should return false (0 === 10)", () => {
      expect(valueMatchValidator(0, 10)).toBe(false);
    });
  });
});
