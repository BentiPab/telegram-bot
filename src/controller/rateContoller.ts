import { MongoServerError } from "mongodb";
import { IRate, Rate } from "../mongo/models/rate";
import { User } from "telegraf/typings/core/types/typegram";

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

const createRate = async (newRate: IRate) => {
  try {
    const rate = await Rate.create(newRate);
    return rate;
  } catch (e) {
    if ((e as MongoServerError).code === 11000) {
      return;
    }
  }
};

const subscribeToRate = async (rateName: string, sub: User) => {
  const rate = await Rate.findOne({ name: rateName });

  const exists = rate?.subscribers.find((s) => s.id === sub.id);
  if (exists) {
    return false;
  }

  return await rate?.updateOne({ $push: { subscribers: sub } });
};

const unsubscribeFromRate = async (rateName: string, sub: User) => {
  const rate = await Rate.findOne({ name: rateName });

  const exists = rate?.subscribers.find((s) => s.id === sub.id);
  if (!exists) {
    return false;
  }
  const newSubs = rate?.subscribers.filter((s) => s.id !== sub.id);

  return await rate?.updateOne({ $set: { subscribers: newSubs } });
};

const getRateSubscribers = async (rateName: string) => {
  const rate = await Rate.findOne({ name: rateName }, { subscribers: true });
  if (!rate) {
    return [];
  }
  return rate.subscribers;
};

export const RateController = {
  getRate,
  createRate,
  updateRate,
  subscribeToRate,
  getRateSubscribers,
  unsubscribeFromRate,
};
