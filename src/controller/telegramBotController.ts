import { Update } from "telegraf/typings/core/types/typegram";
import { RatesNameValue } from "../model";
import { UsersController } from "./userController";
import { formatRateToMessage } from "../utils/formater";
import { RateController } from "./rateContoller";
import { getRateUpdates } from "../services/jobs";
import cron from "node-cron";
import { TIMEZONE } from "../utils/time";
import { LoggerService } from "../logger";
import TelegramBot from "../telegram/telegramBot";

class TelegramBotController {
  constructor() {
    this.runUpdatesCheck();
  }

  private runUpdatesCheck = () => {
    cron.schedule(
      "*/10 10-18 * * 1-5",
      async () => {
        const ratesToCheck = await getRateUpdates();
        await this.sendRateUpdates(ratesToCheck as RatesNameValue[]);
        LoggerService.saveInfoLog("10Min update run");
      },
      { timezone: TIMEZONE, name: "10Min update" }
    );
  };

  private sendRateUpdates = async (rates: RatesNameValue[]) => {
    rates.map(async (r) => {
      const subs = await UsersController.findUsersByRate(r);
      const rate = await RateController.getRate(r);
      if (!subs || !rate) {
        return;
      }
      const subsIds = subs.map((s) => s.id);
      const messageToSend = formatRateToMessage(rate);
      subsIds.map(
        async (id) =>
          await TelegramBot.getInstance().telegram.sendMessage(
            id,
            messageToSend
          )
      );
    });
    if (!!rates.length) {
      LoggerService.saveInfoLog(`Sent update message ${rates.join(", ")}`);
    }
  };

  public handleUpdates = async (update: Update) => {
    await TelegramBot.getInstance().handleUpdate(update);
  };
}

export default TelegramBotController;
