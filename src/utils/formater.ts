import { RateType, RatesNameValue, RatesNamesParsed } from "../model";
import { IRate } from "../mongo/models/rate";
import { Markup } from "telegraf";

export const parseVariation = (variation: string) => {
  variation.replace("%", "").replace(",", ".");
  return parseFloat(variation);
};

export const nameParser: { [k in RatesNameValue]: RatesNamesParsed } = {
  euro_oficial: "Euro Oficial",
  dolar_oficial: "Dolar Oficial",
  dolar: "Dolar Blue",
  euro: "Euro Blue",
};

export const getInlineKeyboardOptions = Object.keys(nameParser).map((k) => [
  Markup.button.callback(nameParser[k as keyof typeof nameParser], k),
]);
export const getNamesParsedArray = Object.values(nameParser).map((v) => v);

export const formatRateToMessage = (data: IRate) => {
  const { compra, venta, fecha, valorCierreAnt, variacion, name } = data;
  const formattedVariation = parseVariation(variacion);
  const parsedName = nameParser[name as RatesNameValue];
  const avg = calculateAvg(compra, venta);
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
  return { ...data, valorCierreAnt: data.valor_cierre_ant, name };
};

export const calculateAvg = (compra: string, venta: string) => {
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
  /subscribe para recibir actualizacion de la moneda que desee
  /unsubscribe para dejar de recibir actualizaciones de la moneda que desee
  /start para recibir nuevamente este mensaje`;
};
