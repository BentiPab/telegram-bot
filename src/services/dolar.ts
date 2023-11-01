import axios from "axios";
import { parseData } from "../utils/formater";
import { ResType } from "../model";
const url = process.env.AMBITO_URL;

export const fetchDollarRate = async () => {
  const res = await axios.get<ResType>(url!);
  const {
    valor_cierre_ant,
    variacion,
    "class-variacion": classVariacion,
    ...dolarData
  } = res.data;
  return parseData({ ...dolarData, name: "dolar" });
};
