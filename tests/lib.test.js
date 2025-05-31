const lib = require("./lib");
const db = require("./db");
const mail = require("./mail");

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
  const supportedCurrencies = ["AUD", "USD", "EUR"];
  it("should return an array of the supported currencies", () => {
    expect(lib.getCurrencies()).toEqual(
      expect.arrayContaining(supportedCurrencies)
    );
  });
});

describe("getProduct", () => {
  it("should return product with the given id", () => {
    const product = lib.getProduct(1);
    expect(product).toMatchObject({
      id: 1,
      price: 10,
    });
  });
});

describe("registerUser", () => {
  it("should throw an error if the username is falsy", () => {
    const args = [null, undefined, NaN, 0, "", false];
    args.forEach((a) =>
      expect(() => {
        lib.registerUser(a);
      }).toThrow()
    );
  });

  it("should return a user object if valid username is provided", () => {
    expect(lib.registerUser("username")).toMatchObject({
      username: "username",
    });
  });
});

describe("applyDiscount", () => {
  it("should apply 10% discount if points is greater then 10", () => {
    db.getCustomerSync = function (customerId) {
      console.log("Fake Reading Customer");
      return { id: customerId, points: 11 };
    };

    const order = { customerId: 1, totalPrice: 50 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(45);
  });
});

describe("notifyCustomer", () => {
  it("should send an email to the customer if the order is placed successfully", () => {
    db.getCustomerSync = function (id) {
      return { email: "email@a.com", id };
    };

    let isMailSent = false;
    mail.send = function () {
      isMailSent = true;
    };

    lib.notifyCustomer({ customerId: 1 });
    expect(isMailSent).toBe(true);
  });
});
