"use strict";

import "jest";

const validator = require("../../src/validator");

var charLenItem = {
  id: "charLen",
  validator: "^.{3}$"
};

var vrnItem = {
  id: "vrn",
  validator:
    "(?<Current>^[A-Z]{2}[0-9]{2}[A-Z]{3}$)|(?<Prefix>^[A-Z][0-9]{1,3}[A-Z]{3}$)|(?<Suffix>^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(?<DatelessLongNumberPrefix>^[0-9]{1,4}[A-Z]{1,2}$)|(?<DatelessShortNumberPrefix>^[0-9]{1,3}[A-Z]{1,3}$)|(?<DatelessLongNumberSuffix>^[A-Z]{1,2}[0-9]{1,4}$)|(?<DatelessShortNumberSufix>^[A-Z]{1,3}[0-9]{1,3}$)"
};

(function() {
  test("should correctly validate item", () => {
    expect(validator.validateItem(vrnItem, "RW61KER")).toBe(true);
    expect(validator.validateItem(vrnItem, "NSF8")).toBe(true);
    expect(validator.validateItem(charLenItem, "123")).toBe(true);
  });

  test("should correctly fail item", () => {
    expect(validator.validateItem(vrnItem, "RW61KERT")).toBe(false);
    expect(validator.validateItem(charLenItem, "1234")).toBe(false);
  });
})();
