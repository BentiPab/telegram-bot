import { RateController } from "../controller/rateContoller";
import { IRate } from "../mongo/models/rate";
import { fetchDollarOficialRate, fetchDollarRate } from "./dolar";
import { fetchEuroOficialRate, fetchEuroRate } from "./euro";

type RateFetcherMap = {
  [k: string]: () => Promise<IRate>;
};

const fetchersMap: RateFetcherMap = {
  dolar: fetchDollarRate,
  euro: fetchEuroRate,
  dolar_oficial: fetchDollarOficialRate,
  euro_oficial: fetchEuroOficialRate,
};

export const fetchRate = async (name: string) => {
  return await fetchersMap[name]();
};

export const getRate = async (name: string) => {
  try {
    return await RateController.getRate(name);
  } catch (e) {
    const newRate = await fetchRate(name);
    return await RateController.createRate(newRate);
  }
};
