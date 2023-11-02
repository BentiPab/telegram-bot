import { ISubscriber, Subscriber } from "../mongo/models/subscriber";
import { MongoServerError } from "mongodb";

const findById = async (id: number) => {
  return await Subscriber.findOne({ id });
};

const createSubscriber = async (subscriber: ISubscriber) => {
  try {
    const user = await Subscriber.create(subscriber);
    return user;
  } catch (e) {
    if ((e as MongoServerError).code === 11000) {
      return;
    }
  }
};

const deleteSubscriber = async (subscriberId: number) => {
  const sub = await Subscriber.findOneAndDelete({ id: subscriberId });
  return sub;
};

const findAll = async () => {
  return await Subscriber.find({}).lean();
};

export const SubscriberController = {
  deleteSubscriber,
  findAll,
  createSubscriber,
};
