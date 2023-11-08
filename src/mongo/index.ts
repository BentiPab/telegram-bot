import mongoose from "mongoose";
import logger, { saveInfoLog } from "../logger";
import config from "../config/base.config";

class MongoConnector {
  private static instance: MongoConnector;

  constructor() {
    this.connectToMongo();
  }

  private connectToMongo = async () => {
    const connectionURI = config.Mongo.Url;

    try {
      saveInfoLog("Connecting to mongo...");
      await mongoose.connect(connectionURI!, {
        dbName: config.Mongo.DbName,
      });
      saveInfoLog("Connected to mongo");
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
