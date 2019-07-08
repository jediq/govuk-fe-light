import * as validator from "./validator";
const logger = require("./util/Logger");

import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

registerPartial("govHeader");
registerPartial("govFooter");
registerPartial("textField");
registerPartial("radioField");
registerPartial("phaseBanner");

handlebars.registerHelper("if_eq", function(a, b, opts) {
  logger.info(`checking equality of ${a} == ${b} ? ${a == b}`);
  if (a == b) {
    return opts.fn();
  } else {
    return opts.inverse();
  }
});

const formPageTemplate = compile("formPage");
const confirmationTemplate = compile("confirmation");
const notFoundPageTemplate = compile("notFoundPage");

function registerPartial(name: string) {
  handlebars.registerPartial(name, fs.readFileSync(path.join(__dirname, `/templates/${name}.html`), "utf8"));
}
function compile(name: string) {
  return handlebars.compile(fs.readFileSync(path.join(__dirname, `/templates/${name}.html`), "utf8"));
}

function renderDocument(context: any) {
  if (context.page) {
    return formPageTemplate(context);
  } else {
    return notFoundPageTemplate(context);
  }
}

function renderConfirmation(context: any) {
  return confirmationTemplate(context);
}
export { renderDocument, renderConfirmation };
