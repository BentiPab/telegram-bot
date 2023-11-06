import { IRate } from "../mongo/models/rate";
export type RateType = Omit<IRate, "valorCierreAnt"> & {
    valor_cierre_ant: string;
    "class-variacion": string;
};
export type RatesNamesParsed = "Euro Oficial" | "Dolar Oficial" | "Dolar Blue" | "Euro Blue";
export type RatesNameKey = "DOLAR" | "EURO" | "EURO_OFICIAL" | "DOLAR_OFICIAL";
export type RatesNameValue = "dolar" | "euro_oficial" | "euro" | "dolar_oficial";
export type RatesNameMapType = {
    [k in RatesNameKey]: RatesNameValue;
};
export declare const RatesNamesMap: RatesNameMapType;
