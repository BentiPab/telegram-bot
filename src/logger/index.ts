import { Logger, transports } from "winston";
import { getLocalTimeString } from "../utils/time";

const LOG_LEVELS = ["error", "info"];

const logger = new Logger({
  transports: [
    ...LOG_LEVELS.map((ll) => new transports.Console({ level: ll })),
    ...LOG_LEVELS.map(
      (ll) =>
        new transports.File({
          level: ll,
          filename: `src/logger/logs/${ll}.log`,
        })
    ),
  ],
});
const saveInfoLog = (message: string) => {
  logger.info(message.concat(` at ${getLocalTimeString()}`));
};

const saveErrorLog = (message: string) => {
  logger.error(message.concat(` at ${getLocalTimeString()}`));
};

export const LoggerService = { saveInfoLog, saveErrorLog };
