import {
  NamesParsedType,
  RateType,
  RatesNameValue,
  RatesNamesParsed,
  ratesNames,
} from "../model";
import { IRate } from "../mongo/models/rate";
import { Markup } from "telegraf";

const BULLET_POINT = "\u2022";

export const parseVariationToMovementMessage = (variation: string) => {
  const formatted = variation.replace("%", "").replace(",", ".");

  if (formatted.includes("-")) {
    return "bajo 📉";
  }

  if (formatted === "0.00" || formatted === "0") {
    return "se mantuvo";
  }

  return "aumento 📈";
};

export const rateNameParser: NamesParsedType = {
  euro_oficial: "Euro Oficial",
  dolar_oficial: "Dolar Oficial",
  dolar: "Dolar Blue",
  euro: "Euro Blue",
  dolar_mep: "Dolar Mep",
  dolar_cripto: "Dolar Cripto",
  dolar_turista: "Dolar Turista",
} as const;

export const getInlineKeyboardOptions = () =>
  ratesNames.map((rn) => Markup.button.callback(rateNameParser[rn], rn));

export const getNamesParsedArray = Object.values(rateNameParser).map((v) => v);

export const formatRateToMessage = (data: IRate) => {
  const { compra, venta, fecha, valorCierreAnt, variacion, name } = data;
  const movimiento = parseVariationToMovementMessage(variacion);
  const parsedName = rateNameParser[name as RatesNameValue];
  const avg = calculateAvg(compra, venta);

  return `El ${parsedName} ${movimiento}
Variacion con ultimo cierre: ${variacion}
${!!valorCierreAnt ? `Valor venta cierre anterior: ${valorCierreAnt}` : ""}
Compra: ${compra}
Venta: ${venta}
Promedio: ${avg}
Ultima actualizacion: ${fecha}`;
};

export const formatSubsMessage = (data: IRate[]) => {
  if (data.length) {
    const mappedRates = data
      .map(
        (r) =>
          `${BULLET_POINT}${
            rateNameParser[r.name as keyof typeof rateNameParser]
          }\n`
      )
      .join(" ");

    return `Usted esta suscrito a las siguientes actualizaciones:\n${mappedRates}`;
  } else {
    return "Usted no cuenta con ninguna suscripcion aun, ingrese /subscribe para comenzar";
  }
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
  const ratesMessage = ratesNames.map(
    (rn) => `/${rn} para recibir el valor del ${rateNameParser[rn]}`
  );
  return `Hola ${userName}! Los comandos disponibles son los siguientes:
/dolar para recibir el valor del Dolar Blue
/dolar_cripto para recibir el valor del Dolar Cripto
/dolar_mep para recibir el valor del Dolar MEP
/dolar_turista para recibir el valor del Dolar Turista
/dolar_oficial para recibir el valor del Dolar Oficial
/euro para recibir el valor del Euro Blue
/euro_oficial para recibir el valor del Euro Oficial
/subscribe para recibir actualizacion de la moneda que desee
/unsubscribe para dejar de recibir actualizaciones de la moneda que desee
/my_subscriptions para ver la lista de suscripciones actuales
/start para recibir nuevamente este mensaje`;
};
