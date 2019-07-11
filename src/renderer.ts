import { Context } from "./Context";
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
  console.log("items : ", JSON.stringify(context.page));
  for (var group of context.page.groups) {
    var items = group.items;
    for (var i = 0; i < items.length; i++) {
      var id = items[i];
      var { page, item }: any = findItem(id, context);
      if (item) {
        items[i] = {
          id: id,
          type: item.type,
          label: item.label,
          value: context.data[id],
          page: page.id
        };
      }
    }
  }

  return confirmationTemplate(context);
}

function findItem(id, context: Context) {
  for (var page of context.service.pages) {
    for (var item of page.items) {
      if (item.id == id) {
        return { page, item };
      }
    }
  }
}
export { renderDocument, renderConfirmation };
