import { User } from "telegraf/typings/core/types/typegram";
import { UserModel } from "../mongo/models/user";
import { Rate } from "../mongo/models/rate";
import { RatesNameValue } from "../model";
import { RateController } from "./rateContoller";
import { rateNameParser } from "../utils/formater";
import { RateService } from "../services";

const createUser = async (user: User) => {
  const exists = await UserModel.findOne({ id: user.id });

  if (exists) {
    return exists;
  }
  const newUser = await UserModel.create(user);
  return newUser;
};

const findUserById = async (userId: number) => {
  const user = await UserModel.findOne({ id: userId }).populate(
    "subscriptions"
  );
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

const findUsersByRate = async (rateName: string) => {
  try {
    const rate = await RateController.getRate(rateName);
    const users = await UserModel.find({ subscriptions: rate?._id });
    return users.filter((u) =>
      u.subscriptions.filter((s) => s.name === rateName)
    );
  } catch (e) {
    return;
  }
};

const handleSubscribeToRate = async (user: User, rateName: RatesNameValue) => {
  const rate = await RateService.getRate(rateName);

  try {
    const userDb = await createUser(user);

    const subscriptions = userDb?.subscriptions;
    const alreadySub = subscriptions?.some((s) => s.name === rateName);
    if (alreadySub) {
      throw new Error(`Usuario ya suscrito a ${rateNameParser[rateName]}`);
    }

    return await userDb?.updateOne({ $push: { subscriptions: rate._id } });
  } catch (e) {
    throw e;
  }
};

const handleUnubscribeToRate = async (
  userId: number,
  rateName: RatesNameValue
) => {
  const rate = await RateController.getRate(rateName);
  if (!rate) {
    throw new Error("Hubo un error interno, pruebe mas tarde");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  const subscriptions = user.subscriptions;
  const alreadySub = subscriptions.some((s) => s.name === rateName);

  if (!alreadySub) {
    throw new Error(`Usuario no suscrito a ${rateNameParser[rateName]}`);
  }

  const newSubs = subscriptions.filter((s) => s.name !== rateName);

  return await user.updateOne({ $set: { subscriptions: newSubs } });
};

const getSubscriptions = async (userId: number) => {
  const user = await findUserById(userId);

  return user?.subscriptions;
};

export const UsersController = {
  findUserById,
  findUsersByRate,
  createUser,
  handleSubscribeToRate,
  handleUnubscribeToRate,
  getSubscriptions,
};
