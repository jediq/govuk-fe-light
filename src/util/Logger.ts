var winston = require("winston");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

module.exports = createLogger({
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()]
});
