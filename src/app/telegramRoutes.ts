import { Router } from "express";
import baseConfig from "../config";
import TelegramBotController from "../controller/telegramBotController";

class TelegramRoutes {
  router: Router;
  public telegramBotController: TelegramBotController =
    new TelegramBotController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(`${baseConfig.Telegram.WebhookDolarUpdatesPath}`, (req) =>
      this.telegramBotController.handleUpdates(req.body)
    );
  }
}

export default TelegramRoutes;
