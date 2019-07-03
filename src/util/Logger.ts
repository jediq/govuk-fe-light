var winston = require("winston");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

module.exports = createLogger({
  level: process.env.npm_config_debug == "true" ? "debug" : "info",
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()]
});
