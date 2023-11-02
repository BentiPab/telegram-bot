import axios from "axios";
import { parseData } from "../utils/formater";
import { RateType, RatesNamesMap } from "../model";
const url = process.env.AMBITO_URL;

const euroUrlMapper = {
  EURO_OFICIAL_URL: `${url}/euro//variacion`,
  EURO_BLUE_URL: `${url}/euro/informal/variacion`,
};

export const fetchEuroRate = async () => {
  const res = await axios.get<RateType>(euroUrlMapper.EURO_BLUE_URL);
  return parseData(res.data, RatesNamesMap.EURO);
};

export const fetchEuroOficialRate = async () => {
  const res = await axios.get<RateType>(euroUrlMapper.EURO_OFICIAL_URL);
  return parseData(res.data, RatesNamesMap.EURO_OFICIAL);
};
