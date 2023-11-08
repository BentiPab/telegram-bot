import { RateController } from "../controller/rateContoller";
import { RatesNameValue } from "../model";
import { IRate } from "../mongo/models/rate";
import {
  fetchDollarCripto,
  fetchDollarMepRate,
  fetchDollarOficialRate,
  fetchDollarRate,
  fetchDollarTurista,
} from "./dolar";
import { fetchEuroOficialRate, fetchEuroRate } from "./euro";

type RateFetcherMap = {
  [k in RatesNameValue]: () => Promise<IRate>;
};

const fetchersMap: RateFetcherMap = {
  dolar: fetchDollarRate,
  euro: fetchEuroRate,
  dolar_oficial: fetchDollarOficialRate,
  euro_oficial: fetchEuroOficialRate,
  dolar_mep: fetchDollarMepRate,
  dolar_cripto: fetchDollarCripto,
  dolar_turista: fetchDollarTurista,
};

export const fetchRate = async (name: RatesNameValue) => {
  return await fetchersMap[name]();
};

export const getRate = async (name: RatesNameValue) => {
  try {
    return await RateController.getRate(name);
  } catch (e) {
    const newRate = await fetchRate(name);
    return await RateController.createRate(newRate);
  }
};
