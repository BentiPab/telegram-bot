import { MongoServerError } from "mongodb";
import { IRate, Rate } from "../mongo/models/rate";

const updateRate = async (name: string, updatedRate: IRate) => {
  const rate = await Rate.findOneAndUpdate(
    { name },
    {
      $set: updatedRate,
    }
  );

  if (!rate) {
    return "rate not found";
  }

  return rate;
};

const getRate = async (name: string) => await Rate.findOne({ name }).lean();

const createRate = async (newRate: Omit<IRate, "avg">) => {
  try {
    const rate = await Rate.create(newRate);
    return rate;
  } catch (e) {
    if ((e as MongoServerError).code === 11000) {
      return;
    }
  }
};

export const RateController = {
  getRate,
  createRate,
  updateRate,
};
