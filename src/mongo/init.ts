import { initRateCollection } from "./models/rate";

const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;

const main = async () => {
  await mongoose.connect(mongoUrl, { dbName: "telegram-bot-dolar" });

  await initRateCollection();
};

main();
