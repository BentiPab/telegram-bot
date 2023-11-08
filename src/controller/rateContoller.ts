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

const getRate = async (name: string) => {
  const rate = await Rate.findOne({ name }).lean();

  if (!rate) {
    return;
  }
  return rate;
};

const createRate = async (newRate: IRate) => {
  const rate = await Rate.create(newRate);
  return rate;
};

export const RateController = {
  getRate,
  createRate,
  updateRate,
};
