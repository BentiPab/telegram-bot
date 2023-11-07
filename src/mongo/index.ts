import mongoose from "mongoose";
import logger from "../logger";

class MongoConnector {
  private static instance: MongoConnector;

  constructor() {
    this.connectToMongo();
  }

  private connectToMongo = async () => {
    const connectionURI = process.env.MONGO_URL;

    try {
      logger.log("info", "Connecting to mongo...");
      await mongoose.connect(connectionURI!, {
        dbName: process.env.MONGO_DB_NAME,
      });
      logger.log("info", "Connected to mongo");
    } catch (error: any) {
      logger.log("error", (error as Error).message);
    }
  };

  static init = (): MongoConnector => {
    if (!MongoConnector.instance) {
      MongoConnector.instance = new MongoConnector();
    }
    return MongoConnector.instance;
  };
}

export default MongoConnector;
