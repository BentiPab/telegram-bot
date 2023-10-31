import { sendDollarUpdated } from "../telegram";
import { formatData } from "../utils/formater";
import { getDollarRate } from "./dolar";

const ONE_MINUTE_MS = 1000 * 60;
const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;

let lastAvg = 0;

type Movement = {
  increased: string;
  decreased: string;
};

const movementMessage: Movement = {
  increased: "El dolar aumento:",
  decreased: "El dolar bajo:",
};

const getPollingDollarRates = async () => {
  setInterval(async () => {
    const rate = await getDollarRate();

    if (rate.avg !== lastAvg) {
      const messageMovement = messageMovementFormatter(rate.avg);
      const dataFormated = formatData(rate);
      const textToSend = `${messageMovement}\n${dataFormated}`;

      sendDollarUpdated(textToSend);
    }
  }, TEN_MINUTES_MS);
};

const messageMovementFormatter = (newAvg: number) => {
  const movement: keyof Movement = newAvg > lastAvg ? "increased" : "decreased";
  const message = movementMessage[movement];

  const mvmtPercentage = (newAvg * 100) / lastAvg - 100;

  return `${message} ${mvmtPercentage}`;
};

getPollingDollarRates();
