import { RateController } from "../controller/rateContoller";
import { RatesNameValue, RatesNamesMap, ratesNames } from "../model";
import { IRate } from "../mongo/models/rate";
import { sendRateUpdates } from "../telegram";
import { formatRateToMessage } from "../utils/formater";
import cron from "node-cron";
import { fetchRate } from "./rate";
import { UsersController } from "../controller/userController";
import { LoggerService } from "../logger";
import { TIMEZONE } from "../utils/time";

const shouldSendRates = async (newRate: IRate) => {
  const oldRate = await RateController.getRate(newRate.name);
  if (!oldRate) {
    await RateController.createRate(newRate);
    return true;
  }
  if (!(newRate.fecha === oldRate.fecha)) {
    await RateController.updateRate(newRate.name, newRate);
    return true;
  }
  return false;
};

const sendAllMessages = async (rate: IRate) => {
  const subs = await UsersController.findUsersByRate(rate.name);
  if (!subs) {
    return;
  }
  const subsIds = subs.map((s) => s.id);
  const messageToSend = formatRateToMessage(rate);
  return subsIds.map(async (id) => await sendRateUpdates(id, messageToSend));
};

const getRateUpdates = async () => {
  try {
    ratesNames.map(async (rn) => {
      const rate = await fetchRate(rn);
      const shouldSendMessages = await shouldSendRates(rate);
      if (shouldSendMessages) {
        LoggerService.saveInfoLog(`Update message sent ${rn}`);
        return await sendAllMessages(rate);
      }
    });
    LoggerService.saveInfoLog(`10min Job`);
  } catch (e) {
    LoggerService.log("error", (e as Error).message);
  }
};

const init = async () => {
  await getRateUpdates();
};

init();
