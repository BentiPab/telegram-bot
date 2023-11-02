import { IRate } from "../mongo/models/rate";

export type RateType = Omit<IRate, "valorCierreAnt" | "avg"> & {
  valor_cierre_ant: string;
  "class-variacion": string;
};

export type RatesNameKey = "DOLAR" | "EURO" | "EURO_OFICIAL" | "DOLAR_OFICIAL";
export type RatesNameValue =
  | "dolar"
  | "euro_oficial"
  | "euro"
  | "dolar_oficial";

export type RatesNameMapType = { [k in RatesNameKey]: RatesNameValue };
export const RatesNamesMap: RatesNameMapType = {
  DOLAR: "dolar",
  EURO_OFICIAL: "euro_oficial",
  EURO: "euro",
  DOLAR_OFICIAL: "dolar_oficial",
};
