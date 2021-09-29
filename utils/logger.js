const { createLogger, format, transports } = require("winston");

const getLogger = createLogger({
  transports: [
    new transports.File({
      filename: "../logs/info.log",
      level: "info",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),
    new transports.File({
      filename: "../logs/error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});


module.exports = {getLogger}