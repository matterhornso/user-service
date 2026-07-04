import winston from "winston";
import path from "path";
const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      // level: process.env.ENVIRONMENT === "prod" ? "error" : "debug"
      level: "debug"
    }),
    new winston.transports.File({ filename: path.join(__dirname, './debug.log'), level: "debug" })
  ]
};

const logger = winston.createLogger(options);

logger.debug("Logging initialized at debug level, env: " + process.env.ENVIRONMENT);

export default logger;