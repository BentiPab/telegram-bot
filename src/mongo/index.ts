import mongoose from "mongoose";
import { LoggerService } from "../logger";
import config from "../config/base.config";

class MongoConnector {
  private static instance: MongoConnector;

  constructor() {
    this.connectToMongo();
  }

  private connectToMongo = async () => {
    const connectionURI = config.Mongo.Url;

    try {
      LoggerService.saveInfoLog("Connecting to mongo...");
      await mongoose.connect(connectionURI!, {
        dbName: config.Mongo.DbName,
      });
      LoggerService.saveInfoLog("Connected to mongo");
    } catch (error: any) {
      LoggerService.saveErrorLog((error as Error).message);
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
