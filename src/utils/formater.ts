import { ResType, ResTypeWithAvg } from "../model";
import { IRate } from "../mongo/models/rate";

export const formatData = (data: IRate) => {
  const { compra, venta, fecha } = parseData(data);
  const avg = getAvg(data);
  return `Compra: ${compra}\nVenta: ${venta}\nPromedio: ${avg}\nFecha: ${fecha}`;
};

export const parseData = (data: Omit<IRate, "avg">): IRate => {
  const avg = getAvg(data);
  return { ...data, avg };
};

export const getAvg = (data: Omit<IRate, "avg">) => {
  const { compra, venta } = data;
  return (parseInt(compra) + parseInt(venta)) / 2;
};

export const GREETING_MESSAGE = `Hola! Los comandos disponibles son los siguientes:
  /dolar: Para recibir el valor del dolar
  /subscribe: para recibir una actualizacion cada 10min durante horario de mercado
  /unsubscribe: para dejar de recibir actualizaciones`;

export const getGreetingMessage = (userName: string) => {
  return `Hola ${userName}! Los comandos disponibles son los siguientes:
  /dolar para recibir el valor del dolar
  /subscribe para recibir una actualizacion cada 10min durante horario de mercado
  /unsubscribe para dejar de recibir actualizaciones`;
};
