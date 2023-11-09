import express, { RequestHandler } from "express";
import bodyParser from "body-parser";
import MongoConnector from "../mongo";
import config from "../config/base.config";
import TelegramRoutes from "./telegramRoutes";
import TelegramBot from "../telegram/telegramBot";

class App {
  private static instance: App;
  private server: express.Express | undefined;

  constructor() {
    this.setExpress();
    this.start(config.Port);
  }

  private setExpress = () => {
    this.server = express();
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(bodyParser.json({ limit: "50mb" }));
    this.server.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

    this.server.use("/", new TelegramRoutes().router);
  };

  public start(port: number): void {
    if (!this.server) {
      return;
    }
    this.server.listen(port, () => {
      MongoConnector.init();
      TelegramBot.initializeWebhook();
    });
  }
  public setBotWebhook = (webhook: RequestHandler) => {
    if (!this.server) {
      return;
    }
    this.server.use(webhook);
  };

  static getInstance = (): App => {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  };

  public getServer = () => {
    if (!this.server) {
      return;
    }
    return this.server;
  };
}

App.getInstance();

export default App;
