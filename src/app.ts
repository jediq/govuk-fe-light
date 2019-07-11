import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as renderer from "./renderer";
import * as validator from "./validator";
import { Context } from "./Context";

const globalService = require("./configuration");
const logger = require("./util/Logger");

const app = <any>express();

app.use("/assets", express.static(path.join(__dirname, "/assets")));

app.use(bodyParser.json({ type: "application/json" }));
app.use(cookieParser(globalService.cookieSecret));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
  const context = new Context(req);
  res.redirect(context.service.firstPage);
});

app.get("/confirmation", (req: express.Request, res: express.Response) => {
  logger.info("rendering confirmation page");
  const context = new Context(req);
  context.page = context.service.confirmation;
  if (!context.isValid()) {
    res.redirect(context.service.firstPage);
    return;
  }

  const document = renderer.renderConfirmation(context);
  createDataCookie(context, res);
  res.send(document);
});

app.get("/:page", (req: express.Request, res: express.Response) => {
  logger.info(`Get request to page ${req.params["page"]}`);
  const context = new Context(req);
  if (!context.isValid()) {
    res.redirect(context.service.firstPage);
    return;
  }
  const document = renderer.renderDocument(context);
  createDataCookie(context, res);
  res.send(document);
});

app.post("/:page", async (req: express.Request, res: express.Response) => {
  logger.info(`Posted to page ${req.params["page"]} : ` + JSON.stringify(req.body));
  var context = new Context(req);
  if (!context.isValid()) {
    res.redirect(context.service.firstPage);
    return;
  }

  try {
    await validator.executePreValidation(context);
    validator.enrichPage(context.page, context);
    validator.executePostValidation(context);
  } catch (error) {
    context.page.valid = false;
    context.page.invalid = true;
  }

  createDataCookie(context, res);

  if (!context.page.valid) {
    res.send(renderer.renderDocument(context));
  } else {
    res.redirect(context.page.nextPage(context));
  }
});

function createDataCookie(context: Context, res: express.Response) {
  var data = context.getEncodedData();
  logger.info("created cookie : " + data.length + " bytes");
  logger.debug("cookie data : " + data);
  res.cookie(context.service.hash, data);
}

module.exports = app;
