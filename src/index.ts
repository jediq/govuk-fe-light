"use strict";
import { Context } from "aws-lambda";

var awsServerlessExpress = require("aws-serverless-express");
var app = require("app");
var server = awsServerlessExpress.createServer(app);

exports.handler = (event: any, context: Context) =>
  awsServerlessExpress.proxy(server, event, context);
