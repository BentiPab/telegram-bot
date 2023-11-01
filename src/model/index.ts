export type ResType = {
  compra: string;
  venta: string;
  fecha: string;
  variacion: string;
  valor_cierre_ant: string;
  "class-variacion": string;
};

export type ResTypeWithAvg = ResType & {
  avg: number;
};
