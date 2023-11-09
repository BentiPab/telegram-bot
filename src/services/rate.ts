import axios from "axios";
import { RateController } from "../controller/rateContoller";
import { RatesNameValue } from "../model";
import { IRate } from "../mongo/models/rate";
import * as DollarService from "./dolar";
import * as EuroService from "./euro";
import baseConfig from "../config";

type RateFetcherMap = {
  [k in RatesNameValue]: () => Promise<IRate>;
};

const fetchersMap: RateFetcherMap = {
  dolar: DollarService.fetchDollarRate,
  euro: EuroService.fetchEuroRate,
  dolar_oficial: DollarService.fetchDollarOficialRate,
  euro_oficial: EuroService.fetchEuroOficialRate,
  dolar_mep: DollarService.fetchDollarMepRate,
  dolar_cripto: DollarService.fetchDollarCripto,
  dolar_turista: DollarService.fetchDollarTurista,
};

export const fetchRate = async (name: RatesNameValue) => {
  return await fetchersMap[name]();
};

export const getRate = async (name: RatesNameValue) => {
  const rate = await RateController.getRate(name);

  if (rate) {
    return rate;
  }
  const newRate = await fetchRate(name);
  return await RateController.createRate(newRate);
};
