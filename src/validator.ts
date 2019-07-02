const logger = require("./util/Logger");
import * as handlebars from "handlebars";
import * as got from "got";

function validateItem(item: any, value: any) {
  logger.debug(`validating ${value} against ${item.validator}`);
  if (undefined === value) {
    value = "";
  }
  return new RegExp(item.validator).test(value);
}

function enrichPage(page: any, context: any) {
  page.valid = true;
  logger.info("page :", page);
  logger.debug("context :", context);

  if (context.data) {
    for (var item of page.items) {
      item.value = context.data[item.id];
      item.valid = validateItem(item, context.data[item.id]);
      item.invalid = !item.valid;
      page.valid = page.valid && item.valid;
      page.invalid = !page.valid;

      // logger.debug(`enriched item value ${valueOf(item.id)} with ${item.value}`);
      //logger.info(`enricheditem ${valueOf(item.id)} with valid? ${item.valid}`);
    }
    logger.debug(`page is valid? ` + page.valid);
  }
}

async function executePreValidation(context: any) {
  if (context.page.preValidation) {
    context.page.preValidation.forEach(async pre => {
      try {
        var urlTemplate = handlebars.compile(pre.url);
        var url = urlTemplate({ context });
        logger.info("calling preValidation url : " + url);
        var response = await got(url, { json: true });
        context.data[pre.name] = response;
      } catch (error) {
        logger.error(JSON.stringify(error));
        logger.error(error.response.body);
      }
    });
  }
}

async function executePostValidation(context: any) {
  if (context.page.postValidation) {
    logger.info("PostV : " + context.page.postValidation);
  }
}

export { validateItem, enrichPage, executePreValidation, executePostValidation };
