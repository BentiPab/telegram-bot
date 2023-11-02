import { Schema, model } from "mongoose";
import { User } from "telegraf/typings/core/types/typegram";
import { RatesNamesMap } from "../../model";
import { getRate } from "../../services/rate";

export interface IRate {
  name: string;
  compra: string;
  venta: string;
  fecha: string;
  variacion: string;
  valorCierreAnt: string;
  subscribers: User[];
}

const rateSchema = new Schema<IRate>(
  {
    name: { type: String, required: true, unique: true },
    compra: { type: String, required: true },
    venta: { type: String, required: true },
    fecha: { type: String, required: true },
    variacion: { type: String, required: true },
    valorCierreAnt: { type: String, required: false },
    subscribers: {
      type: [
        {
          id: { type: Number, required: true },
          first_name: { type: String, required: true },
          last_name: { type: String, required: false },
          username: { type: String, required: false },
        },
      ],
      default: [],
    },
  },
  { id: false, versionKey: false, timestamps: true }
);

export const initRateCollection = async () => {
  const promises = Object.values(RatesNamesMap).map(async (v) => {
    return getRate(v);
  });

  await Promise.allSettled(promises);
};

export const Rate = model<IRate>("Rate", rateSchema);
