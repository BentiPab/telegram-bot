import axios from "axios";
import { formatData, getAvg, parseData } from "../utils/formater";
import { ResType } from "../model";
const url = process.env.AMBITO_URL;

export const getDollarRate = async () => {
  const dolarData = await fetchRateData();
  return parseData(dolarData);
};

const fetchRateData = async () => {
  const res = await axios.get<ResType>(url!);
  return res.data;
};
