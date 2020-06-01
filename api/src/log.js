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

/**
 * @param {import('koa')} app
 */
export default (app) => {
  app.context.log = logger;
};
