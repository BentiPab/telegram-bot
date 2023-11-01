import { Schema, model } from "mongoose";

export interface IRate {
  name: string;
  compra: string;
  venta: string;
  fecha: string;
  avg: number;
}

const rateSchema = new Schema<IRate>(
  {
    name: { type: String, required: true, unique: true },
    compra: { type: String, required: true },
    venta: { type: String, required: true },
    fecha: { type: String, required: true },
    avg: { type: Number, required: true },
  },
  { id: false, timestamps: false, versionKey: false }
);

const createRate = async () => {
  const rate = await Rate.findOne({ name: "dolar" });

  if (rate) {
    return;
  }

  await Rate.create({
    name: "dolar",
    venta: "0",
    compra: "0",
    fecha: "0",
    avg: "0",
  });
};

export const Rate = model<IRate>("Rate", rateSchema);

createRate();
