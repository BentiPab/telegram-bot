import {
  RateType,
  RatesNameKey,
  RatesNameValue,
  RatesNamesMap,
} from "../model";
import { IRate } from "../mongo/models/rate";

export const parseVariation = (variation: string) => {
  variation.replace("%", "").replace(",", ".");
  return parseFloat(variation);
};

export const nameParser: { [k in RatesNameValue]: string } = {
  euro_oficial: "Euro Oficial",
  dolar_oficial: "Dolar Oficial",
  dolar: "Dolar Blue",
  euro: "Euro Blue",
};

export const formatData = (data: IRate) => {
  const { compra, venta, fecha, valorCierreAnt, variacion, avg, name } = data;
  const formattedVariation = parseVariation(variacion);
  const parsedName = nameParser[name as RatesNameValue];
  const movimiento =
    formattedVariation === 0
      ? "se mantuvo"
      : formattedVariation < 0
      ? `bajo 📉`
      : "aumento 📈";
  return `El ${parsedName} ${movimiento}
Variacion con ultimo cierre: ${variacion}
${valorCierreAnt && `Valor venta cierre anterior: ${valorCierreAnt}`}
Compra: ${compra}
Venta: ${venta}
Promedio: ${avg}
Ultima actualizacion: ${fecha}`;
};

export const parseData = (data: RateType, name: string): IRate => {
  const avg = getAvg(data);
  return { ...data, avg, valorCierreAnt: data.valor_cierre_ant, name };
};

export const getAvg = (data: RateType) => {
  const { compra, venta } = data;
  const compraParsed = parseFloat(compra);
  const ventaParsed = parseFloat(venta);
  return ((compraParsed + ventaParsed) / 2).toFixed(2).toString();
};

export const GREETING_MESSAGE = `Hola! Los comandos disponibles son los siguientes:
  /dolar: Para recibir el valor del dolar
  /subscribe: para recibir una actualizacion cada 10min durante horario de mercado
  /unsubscribe: para dejar de recibir actualizaciones`;

export const getGreetingMessage = (userName: string) => {
  return `Hola ${userName}! Los comandos disponibles son los siguientes:
  /dolar para recibir valor del dolar blue
  /dolar_oficial para recibir valor del dolar oficial
  /euro para recibir valor del euro blue
  /euro_oficial para recibir valor del euro oficial
  /subscribe para recibir actualizacion dolar blue cuando la moneda fluctua
  /unsubscribe para dejar de recibir actualizaciones
  /start para recibir nuevamente este mensaje`;
};
