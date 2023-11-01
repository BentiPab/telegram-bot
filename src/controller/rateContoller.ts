import { IRate, Rate } from "../mongo/models/rate";
import { getAvg } from "../utils/formater";

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
  const rate = await Rate.findOne({ name: newRate.name });

  if (rate) {
    return "rate already exists";
  }

  const avg = getAvg(newRate);

  return await Rate.create({ ...newRate, avg });
};

export const RateController = {
  getRate,
  createRate,
  updateRate,
};
