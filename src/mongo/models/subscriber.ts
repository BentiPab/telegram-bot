import { Schema, model } from "mongoose";

export interface ISubscriber {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: string;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    username: { type: String, required: false },
    type: { type: String, required: false },
  },
  { id: false, timestamps: false, versionKey: false }
);

export const Subscriber = model<ISubscriber>("Subscriber", subscriberSchema);
