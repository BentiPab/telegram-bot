import { Schema, model } from "mongoose";
import { fetchDollarRate } from "../../services/dolar";

export interface IRate {
  name: string;
  compra: string;
  venta: string;
  fecha: string;
  avg: string;
  variacion: string;
  valorCierreAnt: string;
}

const rateSchema = new Schema<IRate>(
  {
    name: { type: String, required: true, unique: true },
    compra: { type: String, required: true },
    venta: { type: String, required: true },
    fecha: { type: String, required: true },
    avg: { type: String, required: true },
    variacion: { type: String, required: true },
    valorCierreAnt: { type: String, required: false },
  },
  { id: false, timestamps: false, versionKey: false }
);

rateSchema.pre("save", async function (this: IRate, next) {
  if (!this.avg) {
    const compra = parseFloat(this.compra);
    const venta = parseFloat(this.venta);

    this.avg = ((compra + venta) / 2).toFixed(2).toString();
  }

  next();
});

export const Rate = model<IRate>("Rate", rateSchema);
