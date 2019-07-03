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

app.get("/:page", (req: express.Request, res: express.Response) => {
  const context = new Context(req);
  if (!context.isValid()) {
    res.redirect(context.service.firstPage);
    return;
  }
  const document = renderer.renderDocument(context);
  res.cookie(context.service.hash, context.getEncodedData());
  logger.debug("written cookie : " + context.getEncodedData());

  res.send(document);
});

app.post("/:page", (req: express.Request, res: express.Response) => {
  logger.info(`Posted to page ${req.params["page"]} : ` + JSON.stringify(req.body));

  var context = new Context(req);
  if (!context.isValid()) {
    res.redirect(context.service.firstPage);
    return;
  }

  validator.executePreValidation(context);
  validator.enrichPage(context.page, context);
  validator.executePostValidation(context);

  res.cookie(context.service.hash, context.getEncodedData());
  logger.debug("written cookie : " + context.getEncodedData());

  if (!context.page.valid) {
    const document = renderer.renderDocument(context);
    res.send(document);
  } else {
    res.redirect(context.page.nextPage(context));
  }
});

module.exports = app;
