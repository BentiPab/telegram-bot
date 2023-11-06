import { initRateCollection } from "./models/rate";

const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;

const main = async () => {
  await mongoose.connect(mongoUrl, { dbName: process.env.MONGO_DB_NAME });
  console.log("connected to db");
  await initRateCollection();
};

main();
