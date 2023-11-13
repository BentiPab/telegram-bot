import { User } from "telegraf/typings/core/types/typegram";
import { UserModel } from "../mongo/models/user";
import { RatesNameValue } from "../model";
import { RateController } from "./rateContoller";
import { getUserLanguage } from "../utils/formater";
import { RateService } from "../services";
import i18next from "i18next";
import { LoggerService } from "../logger";

const POPULATE_OPTIONS = [{ path: "subscriptions" }];

const createUser = async (user: User) => {
  const exists = await UserModel.findOne({ id: user.id })
    .populate(POPULATE_OPTIONS)
    .lean();

  if (exists) {
    return exists;
  }
  const newUser = await UserModel.create(user);
  const populated = await newUser.populate(POPULATE_OPTIONS);
  return populated;
};

const findUserById = async (userId: number) => {
  const user = await UserModel.findOne({ id: userId }).populate(
    POPULATE_OPTIONS
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
    LoggerService.saveErrorLog((e as Error).message);
    return;
  }
};

const handleSubscribeToRate = async (
  userId: number,
  rateName: RatesNameValue
) => {
  const rate = await RateService.getRate(rateName);

  try {
    const user = await UserModel.findOneAndUpdate(
      { id: userId },
      { $push: { subscriptions: rate._id } }
    );
    return user;
  } catch (e) {
    LoggerService.saveErrorLog((e as Error).message);
    throw e;
  }
};

const handleUnubscribeToRate = async (
  userId: number,
  rateName: RatesNameValue
) => {
  try {
    const user = await findUserById(userId);

    if (!user) {
      throw new Error("user not found");
    }

    const newSubs = user!.subscriptions.filter((s) => s.name !== rateName);
    await user.updateOne({ $set: { subscriptions: newSubs } });
    return user;
  } catch (e) {
    LoggerService.saveErrorLog((e as Error).message);
    throw e;
  }
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
