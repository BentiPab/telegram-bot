import mongoose, { Schema, model } from "mongoose";
import { User } from "telegraf/typings/core/types/typegram";
import { IRate } from "./rate";

export interface IUser extends User {
  subscriptions: IRate[];
}

const userSchema = new Schema<IUser>(
  {
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    subscriptions: {
      type: [mongoose.Types.ObjectId],
      ref: "Rate",
      default: [],
    },
    language_code: { type: String, required: false },
  },
  { id: false, versionKey: false, timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
