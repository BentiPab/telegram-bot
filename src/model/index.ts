export type ResType = { compra: string; venta: string; fecha: string };

export type ResTypeWithAvg = ResType & {
  avg: number;
};
