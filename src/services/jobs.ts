import { RateController } from "../controller/rateContoller";
import { RatesNamesMap } from "../model";
import { IRate } from "../mongo/models/rate";
import { sendRateUpdates } from "../telegram";
import { formatRateToMessage } from "../utils/formater";
import cron from "node-cron";
import { fetchRate } from "./rate";
import { UsersController } from "../controller/userController";
import logger, { saveInfoLog } from "../logger";
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
  const promises = subsIds.map(
    async (sid) => await sendRateUpdates(sid, messageToSend)
  );

  await Promise.allSettled(promises);
};

const getRateUpdates = async () => {
  try {
    const promises = Object.values(RatesNamesMap).map(async (v) => {
      const rate = await fetchRate(v);
      const shouldSendMessages = await shouldSendRates(rate);
      if (shouldSendMessages) {
        await sendAllMessages(rate);
      }
    });
    await Promise.allSettled(promises);
    saveInfoLog(`10min Job`);
  } catch (e) {
    logger.log("error", (e as Error).message);
  }
};

const UPDATE_CRON_TIMES = "0 */10 * * * 1-5";

const tenMinJob = cron.schedule(
  UPDATE_CRON_TIMES,
  async () => await getRateUpdates(),
  {
    timezone: TIMEZONE,
    name: "Poll Dollar Rates Daily run",
  }
);

const init = async () => {
  tenMinJob.start();
};

init();
