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
  | "Dolar Mep"
  | "Dolar Turista"
  | "Dolar Cripto";

export type RatesNameKey =
  | "DOLAR"
  | "EURO"
  | "EURO_OFICIAL"
  | "DOLAR_OFICIAL"
  | "DOLAR_MEP"
  | "DOLAR_TURISTA"
  | "DOLAR_CRIPTO";
export type RatesNameValue =
  | "dolar"
  | "euro_oficial"
  | "euro"
  | "dolar_oficial"
  | "dolar_mep"
  | "dolar_turista"
  | "dolar_cripto";

export type NamesParsedType = { [k in RatesNameValue]: RatesNamesParsed };

export const ratesNames: RatesNameValue[] = [
  "dolar",
  "dolar_cripto",
  "dolar_mep",
  "dolar_oficial",
  "dolar_turista",
  "euro",
  "euro_oficial",
];

export type RatesNameMapType = { [k in RatesNameKey]: RatesNameValue };
export const RatesNamesMap: RatesNameMapType = {
  DOLAR: "dolar",
  EURO_OFICIAL: "euro_oficial",
  EURO: "euro",
  DOLAR_OFICIAL: "dolar_oficial",
  DOLAR_MEP: "dolar_mep",
  DOLAR_CRIPTO: "dolar_cripto",
  DOLAR_TURISTA: "dolar_turista",
} as const;
