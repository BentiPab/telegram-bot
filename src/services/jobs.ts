import dolar from "../class/dolar";
import { sendDollarUpdated } from "../telegram";
import { formatData } from "../utils/formater";
import { getDollarRate } from "./dolar";

const ONE_MINUTE_MS = 1000 * 60;
const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;

type Movement = {
  increased: string;
  decreased: string;
};

const movementMessage: Movement = {
  increased: "El dolar aumento:",
  decreased: "El dolar bajo:",
};

const isMarketTime = () => {
  const now = new Date().getHours();

  return now > 11 && now < 17;
};

const shouldSendRates = async () => {
  const rate = await getDollarRate();
  if (rate.avg !== dolar.getLastAvg() && isMarketTime()) {
    dolar.setLastAvg(rate.avg);
    const messageMovement = messageMovementFormatter(rate.avg);
    const dataFormated = formatData(rate);
    const textToSend = `${messageMovement}\n${dataFormated}`;

    sendDollarUpdated(textToSend);
  }
};

const getPollingDollarRates = async () => {
  await shouldSendRates();
  setInterval(async () => {
    await shouldSendRates();
  }, ONE_MINUTE_MS / 2);
};

const messageMovementFormatter = (newAvg: number) => {
  const lastAvg = dolar.getLastAvg();
  const movement: keyof Movement = newAvg > lastAvg ? "increased" : "decreased";
  const message = movementMessage[movement];

  const mvmtPercentage = (newAvg * 100) / lastAvg - 100;

  return `${message} ${mvmtPercentage}`;
};

getPollingDollarRates();
