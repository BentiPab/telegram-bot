import { RateController } from "../controller/rateContoller";
import { SubscriberController } from "../controller/subscriberController";
import { RatesNamesMap } from "../model";
import { IRate } from "../mongo/models/rate";
import { sendDollarUpdated } from "../telegram";
import { formatData } from "../utils/formater";
import { fetchDollarRate } from "./dolar";
import cron from "node-cron";

const shouldSendRates = async (newVenta: string) => {
  const oldRate = await RateController.getRate(RatesNamesMap.DOLAR);
  if (!oldRate) {
    return false;
  }
  return parseInt(newVenta) !== parseInt((oldRate as IRate).venta);
};

const getTextToSend = async (rate: IRate) => {
  const dataFormated = formatData(rate);
  return `${dataFormated}`;
};

const sendAllMessages = async (rate: IRate) => {
  const subs = await SubscriberController.findAll();
  const subsIds = subs.map((s) => s.id);
  const messageToSend = await getTextToSend(rate);
  const promises = subsIds.map(async (sid) =>
    sendDollarUpdated(sid, messageToSend)
  );

  await Promise.allSettled(promises);
};

const getDollarRates = async () => {
  const rate = await fetchDollarRate();
  const shouldSendMessages = await shouldSendRates(rate.venta);

  if (shouldSendMessages) {
    await sendAllMessages(rate);
  }

  await RateController.updateRate(RatesNamesMap.DOLAR, rate);
};

cron.schedule("*/10 11-17 * * 1-5", async () => await getDollarRates(), {
  timezone: "America/Buenos_Aires",
});
