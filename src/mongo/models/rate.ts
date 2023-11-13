import mongoose, { Schema, model } from "mongoose";
import { ratesNames } from "../../model";
import { getRate } from "../../services/rate";

export interface IRate {
  _id: mongoose.Types.ObjectId;
  name: string;
  compra: string;
  venta: string;
  fecha: string;
  variacion: string;
  valorCierreAnt: string;
}

const rateSchema = new Schema<IRate>(
  {
    name: { type: String, required: true, unique: true },
    compra: { type: String, required: true },
    venta: { type: String, required: true },
    fecha: { type: String, required: true },
    variacion: { type: String, required: true },
    valorCierreAnt: { type: String, required: false },
  },
  { id: false, versionKey: false, timestamps: true }
);

export const initRateCollection = async () => {
  const promises = ratesNames.map(async (v) => {
    return getRate(v);
  });

  await Promise.allSettled(promises);
};

export const Rate = model<IRate>("Rate", rateSchema);
