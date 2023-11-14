import { Context, Markup, Telegraf } from "telegraf";
import baseConfig from "../config";
import App from "../app";
import { Message, User } from "telegraf/typings/core/types/typegram";
import { UsersController } from "../controller/userController";
import {
  availableLanguages,
  formatRateToMessage,
  formatSubsMessage,
  getGreetingMessage,
  getLanguageKeyboardOptions,
  getSubscriptionKeyboardOptions,
  getUserLanguage,
} from "../utils/formater";
import { LoggerService } from "../logger";
import { RatesNameValue, ratesNames } from "../model";
import { RateService } from "../services";
import { message } from "telegraf/filters";
import i18next from "i18next";
import { IRate } from "../mongo/models/rate";
import { getLocalTimeString } from "../utils/time";

class TelegramBot extends Telegraf {
  private static instance: TelegramBot;
  master = 6677122686;

  constructor(token: string, options?: Partial<Telegraf.Options<Context>>) {
    super(token, options);
  }

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new TelegramBot(baseConfig.Telegram.BotToken);
      this.startBot();
    }
    return this.instance;
  };

  static startBot = () => {
    this.initializeMiddleware();
    this.initializeCommands();
    this.initializeTexts();
    this.instance.launch();
  };

  static sendUpdateToMaster = async (message: string) => {
    const formattedMessage = `${message} at ${getLocalTimeString()}`;
    await this.instance.telegram.sendMessage(
      this.instance.master,
      formattedMessage
    );
  };

  static handleTexts = async (ctx: Context) => {
    const user = ctx.state.user;
    const text = (ctx.message as Message.TextMessage).text;

    if (user.username === "iWallas") {
      ctx.reply("Waldo come verga");
      return;
    }

    if (text[0] === "/") {
      ctx.reply(
        i18next.t("error.unrecongnisedCommand", {
          lng: getUserLanguage(user.language_code),
        })
      );
      return;
    }
    ctx.reply(getGreetingMessage(user));
  };

  static handleStartCommand = async (ctx: Context) => {
    const user = ctx.state.user;
    ctx.reply(getGreetingMessage(user));
  };

  static handleRateSubscription = async (
    ctx: Context,
    rateName: RatesNameValue
  ) => {
    const user = ctx.state.user;
    const subs = user.subscriptions as IRate[];

    const isSubbed = subs.some((s) => s.name === rateName);
    try {
      if (isSubbed) {
        await UsersController.handleUnubscribeToRate(user.id, rateName);
        LoggerService.saveInfoLog(
          `${user.first_name} unsuscribed from ${rateName}`
        );

        this.sendUpdateToMaster(
          `New unsub req to ${rateName} from user ${user.first_name}`
        );
        ctx.reply(
          i18next.t("user.unsubscribedSuccessful", {
            rateName,
            lng: getUserLanguage(user.language_code),
          })
        );
        return;
      } else {
        await UsersController.handleSubscribeToRate(user.id, rateName);
        LoggerService.saveInfoLog(
          `${user?.first_name} suscribed to ${rateName}`
        );

        this.sendUpdateToMaster(
          `New sub req to ${rateName} from user ${user.first_name}`
        );
        ctx.reply(
          i18next.t("user.subscribedSuccessful", {
            rateName,
            lng: getUserLanguage(user.language_code),
          })
        );
      }
    } catch (e) {
      ctx.reply(
        i18next.t("error.somethingWentWrong", {
          rateName,
          lng: getUserLanguage(user.language_code),
        })
      );
    } finally {
      ctx.answerCbQuery();
      ctx.editMessageReplyMarkup(undefined);
    }
  };

  static handleGetRateCommand = async (
    ctx: Context,
    rateName: RatesNameValue
  ) => {
    const user = ctx.state.user;
    const rate = await RateService.getRate(rateName);

    if (!rate) {
      ctx.reply("Hubo un problema, intente mas tarde");
      return;
    }
    const rateFormatted = formatRateToMessage(rate, user.language_code);
    ctx.reply(rateFormatted);

    this.sendUpdateToMaster(`New ${rateName} from user ${user.first_name}`);
    LoggerService.saveInfoLog(`${user.first_name} requested ${rateName} rate`);
  };

  static handleMySubscriptionsCommand = async (ctx: Context) => {
    const user = ctx.state.user;
    const subsmessage = formatSubsMessage(
      user.subscriptions,
      user.language_code
    );

    ctx.replyWithMarkdownV2(subsmessage, { parse_mode: "HTML" });
  };

  static subscribeCallback = async (
    ctx: Context,
    type: "subscribe" | "unsubscribe"
  ) => {
    const user = ctx.state.user;
    const message = i18next.t(`user.${type}`, {
      lng: getUserLanguage(user.language_code),
    });
    const markup = Markup.inlineKeyboard(
      getSubscriptionKeyboardOptions(user, type),
      {
        columns: 2,
      }
    );
    await ctx.reply(message, {
      parse_mode: "HTML",
      ...markup,
    });
  };

  static handleLanguageCommand = async (ctx: Context) => {
    const user = ctx.state.user;
    const message = i18next.t(`user.languageChange`, {
      lng: getUserLanguage(user.language_code),
      userLang: user.language_code,
    });

    const markup = Markup.inlineKeyboard(getLanguageKeyboardOptions(user), {
      columns: 2,
    });
    await ctx.reply(message, {
      parse_mode: "HTML",
      ...markup,
    });
  };

  static handleLanguageChange = async (ctx: Context, newLang: string) => {
    const user = ctx.state.user;
    if (newLang !== "cancel") {
      await UsersController.updateUserLang(user.id, newLang);
      ctx.reply(i18next.t("user.languageChangeSuccessfull", { lng: newLang }));
    }
    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup(undefined);
  };

  static initializeCommands = () => {
    this.instance.start(this.handleStartCommand);
    this.instance.command("subscribe", (ctx: Context) =>
      this.subscribeCallback(ctx, "subscribe")
    );
    this.instance.command("unsubscribe", (ctx: Context) =>
      this.subscribeCallback(ctx, "unsubscribe")
    );

    ratesNames.forEach((v) =>
      this.instance.command(v, (ctx: Context) =>
        this.handleGetRateCommand(ctx, v)
      )
    );

    this.instance.command(
      "my_subscriptions",
      this.handleMySubscriptionsCommand
    );
    availableLanguages.forEach((l) =>
      this.instance.action(l, (ctx) => this.handleLanguageChange(ctx, l))
    );

    this.instance.action("cancel", (ctx) =>
      this.handleLanguageChange(ctx, "cancel")
    );

    this.instance.command("language", this.handleLanguageCommand);
    ratesNames.forEach((rn) => {
      this.instance.action(rn, (ctx) => this.handleRateSubscription(ctx, rn));
    });
  };

  static initializeMiddleware() {
    this.instance.use(async (ctx, next) => {
      const user = await UsersController.createUser(ctx.from!);
      ctx.state.user = user;
      next();
    });
  }

  static initializeTexts = () => {
    this.instance.on(message("text"), this.handleTexts);
  };

  static initializeWebhook = async () => {
    if (baseConfig.App.Env === "production") {
      this.instance.telegram.setWebhook(
        baseConfig.Telegram.WebhookDolarUpdatesUrl
      );
      const webhookCallback = this.instance.webhookCallback(
        baseConfig.Telegram.WebhookDolarUpdatesPath
      );
      App.getInstance().setBotWebhook(webhookCallback);
    }
  };
}
TelegramBot.getInstance();

export default TelegramBot;
