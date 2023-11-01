import { ISubscriber, Subscriber } from "../mongo/models/subscriber";

const findById = async (id: number) => {
  return await Subscriber.findOne({ id });
};

const createSubscriber = async (subscriber: ISubscriber) => {
  const alreadyUser = await findById(subscriber.id);

  if (!!alreadyUser) {
    return "Usuario ya suscrito";
  }

  const newSubscriber = new Subscriber(subscriber);
  await newSubscriber.save();

  return "Usuario suscrito con exito!!";
};

const deleteSubscriber = async (subscriberId: number) => {
  const sub = await findById(subscriberId);

  if (!sub) {
    return "Usuario no se encuentra suscrito";
  }

  await sub.deleteOne();
  return "Usuario desuscrito con exito";
};

const findAll = async () => {
  return await Subscriber.find({}).lean();
};

export const SubscriberController = {
  deleteSubscriber,
  findAll,
  createSubscriber,
};
