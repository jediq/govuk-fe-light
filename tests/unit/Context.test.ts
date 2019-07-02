"use strict";

import "jest";
import { Context } from "../../src/Context";

var CryptoJS = require("crypto-js");

(function() {
  test("test context creation", () => {
    var req = {
      params: {
        page: "vrn"
      },
      cookies: {
        "-1751705032": "U2FsdGVkX1+Y8yFOzryWntoayji/Tgx6vykHqz8BkazBTYBjn7tYVqx8TBVcpeI/JE9LVH2fDVjlEZNIheTu5g=="
      }
    };

    var context = new Context(req);

    expect(context.data.field1).toBe("val1");
  });

  test("encryption / decryption", () => {
    var message = JSON.stringify({ field1: "val1", field2: "val2" });
    var secret = "8y/B?D(G+KbPeShVmYq3t6w9z$C&F)H@";
    var ciphertext = CryptoJS.AES.encrypt(message, secret).toString();
    console.log("ciphertext", ciphertext);

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    expect(originalText).toBe(message);
  });
})();
