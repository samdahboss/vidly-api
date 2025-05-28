const exercise1 = require("./exercise1.js");

describe("FizzBuzz", () => {
  it("should throw an error if the input is not a number", () => {
    expect(() => {
      exercise1.fizzBuzz("1");
    }).toThrow();

    expect(() => {
      exercise1.fizzBuzz(null);
    }).toThrow();

    expect(() => {
      exercise1.fizzBuzz(undefined);
    }).toThrow();

    expect(() => {
      exercise1.fizzBuzz(false);
    }).toThrow();

    expect(() => {
      exercise1.fizzBuzz({});
    }).toThrow();
  });

  it("should return 'FizzBuzz' if the number is divisible by 3 & 5", () => {
    expect(exercise1.fizzBuzz(15)).toEqual("FizzBuzz");
  });

  it("should return 'Fizz' if the number is divisible by 3", () => {
    expect(exercise1.fizzBuzz(3)).toEqual("Fizz");
  });

  it("should return 'Buzz' if the number is divisible by 5", () => {
    expect(exercise1.fizzBuzz(5)).toEqual("Buzz");
  });

  it("should return input if the number is not divisible by 3 or 5", () => {
    expect(exercise1.fizzBuzz(16)).toEqual(16);
  });
});
