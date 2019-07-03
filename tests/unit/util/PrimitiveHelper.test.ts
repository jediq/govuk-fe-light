"use strict";

import "jest";
import { functionify, objectify } from "../../../src/util/PrimitiveHelper";

(function() {
  test("functionify with fake data", () => {
    var object = {
      func1() {
        return "func1";
      },
      func2: () => "func2",
      prim1: 1,
      prim2: "prim2",
      subobj: {
        func3: () => "func3",
        prim3: "prim3",
        prim4: 4
      },
      array1: [1, 2, () => 3],
      array2: [
        {
          func4: () => "func4",
          prim5: 5
        },
        {
          func5: () => "func5",
          prim6: 6
        }
      ]
    };

    functionify(object);

    Object.keys(object).forEach(key => {
      expect(typeof object[key]).toBe("function");
    });

    expect(object.func1()).toBe("func1");
    expect(object.func2()).toBe("func2");

    // this is fugly due to casting rules in typescript and the compiler thinking it knows best
    // it doesn't need to be this fugly in the production code, just the test code
    expect(((object.prim1 as any) as Function)()).toBe(1);
    expect(((object.prim2 as any) as Function)()).toBe("prim2");

    expect(typeof object.subobj).toBe("function");
    expect(((object.subobj as any) as Function)().func3()).toBe("func3");
    expect(((object.subobj as any) as Function)().prim3()).toBe("prim3");
    expect(((object.subobj as any) as Function)().prim4()).toBe(4);

    expect(((object.array1 as any) as Function)()[0]()).toBe(1);
    expect(((object.array1 as any) as Function)()[1]()).toBe(2);
    expect(((object.array1 as any) as Function)()[2]()).toBe(3);

    expect(((object.array2 as any) as Function)()[0]().func4()).toBe("func4");
    expect(((object.array2 as any) as Function)()[0]().prim5()).toBe(5);
  });

  test("functionify with service data", () => {
    let service = require("../../../src/configuration");
    functionify(service);
    var page1 = service.pages().find((page: any) => page().id() === "page1");
    expect(page1().id()).toBe("page1");
  });

  test("objectify with fake data", () => {
    var object = {
      func1() {
        return "func1";
      },
      func2: () => "func2",
      prim1: 1,
      prim2: "prim2",
      subobj: {
        func3: () => "func3",
        prim3: "prim3",
        prim4: 4
      },
      array1: [1, 2, () => 3],
      array2: [
        {
          func4: () => "func4",
          prim5: 5
        },
        {
          func5: () => "func5",
          prim6: 6
        }
      ]
    };

    objectify(object, {});

    Object.keys(object).forEach(key => {
      expect(typeof object[key]).not.toBe("function");
    });

    expect(object.func1 as any).toBe("func1");
    expect(object.func2 as any).toBe("func2");

    // this is fugly due to casting rules in typescript and the compiler thinking it knows best
    // it doesn't need to be this fugly in the production code, just the test code
    expect(object.prim1 as any).toBe(1);
    expect(object.prim2 as any).toBe("prim2");

    expect(typeof object.subobj).not.toBe("function");
    expect((object.subobj as any).func3).toBe("func3");
    expect((object.subobj as any).prim3).toBe("prim3");
    expect((object.subobj as any).prim4).toBe(4);

    expect((object.array1 as any)[0]).toBe(1);
    expect((object.array1 as any)[1]).toBe(2);
    expect((object.array1 as any)[2]).toBe(3);

    expect((object.array2 as any)[0].func4).toBe("func4");
    expect((object.array2 as any)[0].prim5).toBe(5);
    expect((object.array2 as any)[1].func5).toBe("func5");
    expect((object.array2 as any)[1].prim6).toBe(6);
  });

  test("objectify with service data", () => {
    let service = require("../../../src/configuration");
    var context = {
      data: {
        channelField: "phone"
      }
    };
    objectify(service, context);
    var page1 = service.pages.find((page: any) => page.id === "page1");
    expect(page1.id).toBe("page1");
  });

  test("objectify with simple array as array", () => {
    let service = {
      array: [{ id: 1 }, { id: 2 }, { id: 3 }]
    };

    objectify(service, {});
    var item1 = service.array.find((item: any) => item.id === 1);
    expect(item1).not.toBeUndefined();
    item1 && expect(item1.id).toBe(1);
  });

  test("objectify with simple array as function", () => {
    let service = {
      array: () => [{ id: 1 }, { id: 2 }, { id: 3 }]
    };

    objectify(service, {});
    var item1 = (service.array as any).find((item: any) => item.id === 1);
    expect(item1).not.toBeUndefined();
    item1 && expect(item1.id).toBe(1);
  });
})();
