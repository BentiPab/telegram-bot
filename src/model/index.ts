import { IRate } from "../mongo/models/rate";

export type RateType = Omit<IRate, "valorCierreAnt"> & {
  valor_cierre_ant: string;
  "class-variacion": string;
};

export type RatesNameValue =
  | "dolar"
  | "euro_oficial"
  | "euro"
  | "dolar_oficial"
  | "dolar_mep"
  | "dolar_turista"
  | "dolar_cripto";

export const ratesNames: RatesNameValue[] = [
  "dolar",
  "dolar_cripto",
  "dolar_mep",
  "dolar_oficial",
  "dolar_turista",
  "euro",
  "euro_oficial",
];

export const RatesNamesMap = {
  DOLAR: "dolar",
  EURO_OFICIAL: "euro_oficial",
  EURO: "euro",
  DOLAR_OFICIAL: "dolar_oficial",
  DOLAR_MEP: "dolar_mep",
  DOLAR_CRIPTO: "dolar_cripto",
  DOLAR_TURISTA: "dolar_turista",
} as const;
