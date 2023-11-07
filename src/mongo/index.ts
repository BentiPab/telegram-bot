import mongoose from "mongoose";

class MongoConnector {
  private static instance: MongoConnector;

  constructor() {
    this.connectToMongo();
  }

  private connectToMongo = async () => {
    const connectionURI = process.env.MONGO_URL;

    try {
      console.log("Connecting to mongo...");
      await mongoose.connect(connectionURI!, {
        dbName: process.env.MONGO_DB_NAME,
      });
      console.log("Connected to mongo");
    } catch (error: any) {
      console.log("Mongo connection error");
      console.log(error);
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
