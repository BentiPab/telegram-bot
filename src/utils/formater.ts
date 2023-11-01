import { ResType, ResTypeWithAvg } from "../model";

export const formatData = (data: ResType) => {
  const { compra, venta, fecha } = parseData(data);
  const avg = getAvg(data);
  return `Compra: ${compra}\nVenta: ${venta}\nPromedio: ${avg}\nFecha: ${fecha}`;
};

export const parseData = (data: ResType): ResTypeWithAvg => {
  const avg = getAvg(data);
  return { ...data, avg };
};

export const getAvg = (data: ResType) => {
  const { compra, venta } = data;
  return (parseInt(compra) + parseInt(venta)) / 2;
};
