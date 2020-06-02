/**
 * Basic, extensible async logger
 */

import Winston from "winston";

const { createLogger, format, transports } = Winston;

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console()],
});

process.on("uncaughtException", (err) => {
  logger.error(err);
});
process.on("unhandledRejection", (err) => {
  logger.error(err);
});

/**
 * @param {import('koa')} app
 */
export default (app) => {
  app.context.log = logger;
};
