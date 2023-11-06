import { RateController } from "../controller/rateContoller";
import { RatesNamesMap } from "../model";
import { IRate } from "../mongo/models/rate";
import { sendRateUpdates } from "../telegram";
import { formatRateToMessage } from "../utils/formater";
import cron from "node-cron";
import { fetchRate } from "./rate";

const shouldSendRates = async (newRate: IRate, skipCheck: boolean) => {
  const oldRate = await RateController.getRate(newRate.name);
  if (!oldRate) {
    console.log("update");
    await RateController.createRate(newRate);
    return true;
  }

  if (!newRate.fecha.match(oldRate.fecha) || skipCheck) {
    console.log("update");
    await RateController.updateRate(newRate.name, newRate);
    return true;
  }
  return false;
};

const sendAllMessages = async (rate: IRate) => {
  const subs = await RateController.getRateSubscribers(rate.name);
  const subsIds = subs.map((s) => s.id);
  const messageToSend = formatRateToMessage(rate);
  const promises = subsIds.map(async (sid) =>
    sendRateUpdates(sid, messageToSend)
  );

  await Promise.allSettled(promises);
};

const getRateUpdates = async (skipCheck = false) => {
  const promises = Object.values(RatesNamesMap).map(async (v) => {
    const rate = await fetchRate(v);
    const shouldSendMessages = await shouldSendRates(rate, skipCheck);
    if (shouldSendMessages) {
      await sendAllMessages(rate);
    }
  });

  await Promise.allSettled(promises);
};

const UPDATE_CRON_TIMES = "10/10 11-19 * * 1-5";
const START_CRON_TIMES = "0 11 * * 1-5";

cron.schedule(UPDATE_CRON_TIMES, async () => await getRateUpdates(), {
  timezone: "America/Buenos_Aires",
  name: "Poll Dollar Rates",
});

cron.schedule(START_CRON_TIMES, async () => await getRateUpdates(true), {
  timezone: "America/Buenos_Aires",
  name: "Poll Dollar Rates",
});
