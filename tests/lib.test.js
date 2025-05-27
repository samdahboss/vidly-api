const lib = require("./lib");

describe("absolute", () => {
  it("should return Positive for Positive Input", () => {
    expect(lib.absolute(1)).toBe(1);
  });

  it("should return Positive for Negative Input", () => {
    expect(lib.absolute(-1)).toBe(1);
  });

  it("should return Zero for Zero Input", () => {
    expect(lib.absolute(0)).toBe(0);
  });
});

describe("greet", () => {
  it("should return greeting message", () => {
    expect(lib.greet("Samuel")).toContain("Samuel");
  });
});

describe("getCurrency", () => {
  const supportedCurrencies = ["AUD", "USD",  "EUR"];
  it("should return an array of the supported currencies", () => {
    expect(lib.getCurrencies()).toEqual(
      expect.arrayContaining(supportedCurrencies)
    );
  });
});
