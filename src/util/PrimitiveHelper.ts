const logger = require("./Logger");

export function valueOf(obj: any, context: any) {
  if (typeof obj === "function") {
    return obj(context);
  } else {
    return obj;
  }
}

export function functionify(obj: any) {
  logger.debug("functionify called for :", obj);
  if (obj instanceof Function) {
    logger.debug("returning a function");
    return obj;
  }
  if (obj instanceof Array) {
    logger.debug("it's an array!");
    for (var i = 0; i < obj.length; i++) {
      obj[i] = functionify(obj[i]);
    }
  } else {
    if (obj instanceof Object) {
      Object.keys(obj).forEach(key => {
        obj[key] = functionify(obj[key]);
        logger.debug(`set ${key} to ${obj[key]}`);
        logger.debug(`typeof ${key} is now ${typeof obj[key]}`);
      });
    }
  }
  return () => obj;
}

export function objectify(obj: any, context: any) {
  logger.debug("objectify called for  :", obj);
  if (obj instanceof Function) {
    var executed = obj(context);
    objectify(executed, context);
    return executed;
  }
  if (obj instanceof Array) {
    logger.debug("it's an array!");
    for (var i = 0; i < obj.length; i++) {
      logger.debug(`Element [${i}] is ${obj[i]} : ${JSON.stringify(obj[i])}`);
      logger.debug("recursively calling for array element" + i);
      obj[i] = objectify(obj[i], context);
      logger.debug(`Element [${i}] is now ${obj[i]} : ${JSON.stringify(obj[i])}`);
    }
  } else {
    if (obj instanceof Object) {
      Object.keys(obj).forEach(key => {
        logger.debug("recursively calling for object property " + key + " : " + typeof obj[key]);
        obj[key] = objectify(obj[key], context);
      });
    }
  }
  return obj;
}
