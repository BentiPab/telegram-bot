import { initRateCollection } from "./models/rate";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL;

const main = async () => {
  await mongoose.connect(mongoUrl!, { dbName: process.env.MONGO_DB_NAME });
  console.log("connected to db");
  await initRateCollection();
};

main();
