import { IRate } from "../mongo/models/rate";

export type RateType = Omit<IRate, "valorCierreAnt"> & {
  valor_cierre_ant: string;
  "class-variacion": string;
};

export type RatesNamesParsed =
  | "Euro Oficial"
  | "Dolar Oficial"
  | "Dolar Blue"
  | "Euro Blue"
  | "Dolar Mep";

export type RatesNameKey =
  | "DOLAR"
  | "EURO"
  | "EURO_OFICIAL"
  | "DOLAR_OFICIAL"
  | "DOLAR_MEP";
export type RatesNameValue =
  | "dolar"
  | "euro_oficial"
  | "euro"
  | "dolar_oficial"
  | "dolar_mep";

export type RatesNameMapType = { [k in RatesNameKey]: RatesNameValue };
export const RatesNamesMap: RatesNameMapType = {
  DOLAR: "dolar",
  EURO_OFICIAL: "euro_oficial",
  EURO: "euro",
  DOLAR_OFICIAL: "dolar_oficial",
  DOLAR_MEP: "dolar_mep",
};
