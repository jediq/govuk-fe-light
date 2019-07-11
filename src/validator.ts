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

  for (var item of page.items) {
    item.value = context.data[item.id];
    item.valid = validateItem(item, context.data[item.id]);
    item.invalid = !item.valid;
    page.valid = page.valid && item.valid;
    page.invalid = !page.valid;
  }

  if (context.page.validation && context.page.validation.validator) {
    var pageValid = context.page.validation.validator(context);
    page.valid = page.valid && pageValid;
    page.invalid = !page.valid;
    if (page.invalid) {
      page.error = context.page.validation.error;
    }
  }
  logger.debug(`page is valid? ` + page.valid);
}

async function executePreValidation(context: any) {
  logger.debug("Page has prevalidation? " + context.page.preValidation);
  if (context.page.preValidation) {
    for (var pre of context.page.preValidation) {
      try {
        var urlTemplate = handlebars.compile(process.env.npm_config_debug !== "true" ? pre.url : pre.debugUrl);
        var url = urlTemplate({ context });
        logger.info("calling preValidation url : " + url);
        //var response = await superagent.get(url);
        const response = await got(url);

        logger.debug("response.body : " + response.body);
        context.data[pre.id] = JSON.parse(response.body);
        logger.debug(`added to context.data[${pre.id}]: ` + context.data[pre.id]);
        logger.debug(`context.data after pre validation : ` + JSON.stringify(context.data));
      } catch (error) {
        logger.error(`here's the error: ` + error);
        logger.error(error.response);
      }
    }
  }
}

async function executePostValidation(context: any) {
  if (context.page.postValidation) {
    logger.info("PostV : " + context.page.postValidation);
  }
}

export { validateItem, enrichPage, executePreValidation, executePostValidation };
