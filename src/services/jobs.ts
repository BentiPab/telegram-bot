import { RateController } from "../controller/rateContoller";
import { RatesNameValue, ratesNames } from "../model";
import { IRate } from "../mongo/models/rate";
import { fetchRate } from "./rate";
import { LoggerService } from "../logger";

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

export const getRateUpdates = async () => {
  try {
    const ratesToSend = ratesNames.map(async (rn) => {
      const rate = await fetchRate(rn);
      const shouldSendMessages = await shouldSendRates(rate);
      if (shouldSendMessages) {
        return rn;
      }
      return undefined;
    });
    const rates = await Promise.all(ratesToSend);
    const ratesFiltered = rates.filter((r) => !!r) as RatesNameValue[];
    return ratesFiltered as RatesNameValue[];
  } catch (e) {
    LoggerService.saveErrorLog((e as Error).message);
  }
};
