import axios from "axios";
import { parseData } from "../utils/formater";
import { RateType, RatesNamesMap } from "../model";
import baseConfig from "../config";
const url = baseConfig.App.AmbitoUrl;

const dolarUrlMapper = {
  DOLAR_BLUE_URL: `${url}/dolar/informal/variacion`,
  DOLAR_OFICIAL_URL: `${url}/dolarnacion//variacion`,
};

export const fetchDollarRate = async () => {
  const res = await axios.get<RateType>(dolarUrlMapper.DOLAR_BLUE_URL);
  return parseData(res.data, RatesNamesMap.DOLAR);
};

export const fetchDollarOficialRate = async () => {
  const res = await axios.get<RateType>(dolarUrlMapper.DOLAR_OFICIAL_URL);
  return parseData(res.data, RatesNamesMap.DOLAR_OFICIAL);
};
