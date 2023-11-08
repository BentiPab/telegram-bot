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
  try {
    const rate = await Rate.findOne({ name }).lean();
    return rate;
  } catch (e) {
    throw new Error("Rate not found");
  }
};

const createRate = async (newRate: IRate) => {
  try {
    const rate = await Rate.create(newRate);
    return rate;
  } catch (e) {}
};

export const RateController = {
  getRate,
  createRate,
  updateRate,
};
