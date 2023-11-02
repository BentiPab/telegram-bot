import { RateController } from "../controller/rateContoller";
import { SubscriberController } from "../controller/subscriberController";
import { IRate } from "../mongo/models/rate";
import { sendDollarUpdated } from "../telegram";
import { formatData } from "../utils/formater";
import { fetchDollarRate } from "./dolar";

const ONE_MINUTE_MS = 1000 * 60;
const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;

type Movement = {
  increased: string;
  decreased: string;
};

const movementMessage: Movement = {
  increased: "El dolar aumento 📈:",
  decreased: "El dolar bajo 📉:",
};

const isMarketTime = () => {
  const now = new Date().getHours();

  return now > 11 && now < 17;
};

const shouldSendRates = async (newAvg: number) => {
  const oldRate = await RateController.getRate("dolar");
  if (!oldRate) {
    return false;
  }
  return newAvg !== (oldRate as IRate).avg && isMarketTime();
};

const getTextToSend = async (rate: IRate) => {
  const messageMovement = await messageMovementFormatter(rate.avg);
  const dataFormated = formatData(rate);
  return `${messageMovement}\n${dataFormated}`;
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
  const shouldSendMessages = await shouldSendRates(rate.avg);

  if (shouldSendMessages) {
    await sendAllMessages(rate);
  }

  await RateController.updateRate("dolar", rate);
};

const getPollingDollarRates = async () => {
  await getDollarRates();
  setInterval(async () => {
    await getDollarRates();
  }, TEN_MINUTES_MS);
};

const messageMovementFormatter = async (newAvg: number) => {
  const oldRate = await RateController.getRate("dolar");
  const oldAvg = oldRate?.avg ?? 0;
  const movement: keyof Movement = newAvg > oldAvg ? "increased" : "decreased";
  const message = movementMessage[movement];

  const mvmtPercentage = (newAvg * 100) / oldAvg - 100;

  return `${message} ${mvmtPercentage}`;
};

getPollingDollarRates();
