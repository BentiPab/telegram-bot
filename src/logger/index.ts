import { Logger, transports } from "winston";

const LOG_LEVELS = ["error", "info"];

const logger = new Logger({
  transports: [
    new transports.Console({ level: "debug" }),
    ...LOG_LEVELS.map(
      (ll) =>
        new transports.File({
          level: ll,
          filename: `logger/logs/${ll}.log`,
        })
    ),
  ],
});

export default logger;
