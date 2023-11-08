import { Logger, transports } from "winston";
import { getLocalTimeString } from "../utils/time";

const LOG_LEVELS = ["error", "info"];

const logger = new Logger({
  transports: [
    new transports.Console({ level: "info" }),
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
  logger.log("info", message.concat(` at ${getLocalTimeString()}`));
};

export const LoggerService = { ...logger, saveInfoLog };
