import { Context, Markup, Telegraf } from "telegraf";
import baseConfig from "../config";
import App from "../app";
import {
  CallbackQuery,
  Message,
  Update,
  User,
} from "telegraf/typings/core/types/typegram";
import { UsersController } from "../controller/userController";
import {
  formatRateToMessage,
  formatSubsMessage,
  getGreetingMessage,
  getInlineKeyboardOptions,
  rateNameParser,
} from "../utils/formater";
import { LoggerService } from "../logger";
import { RatesNameValue, ratesNames } from "../model";
import { RateService } from "../services";
import { callbackQuery, message } from "telegraf/filters";

class TelegramBot extends Telegraf {
  private static instance: TelegramBot;

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
    this.initializeCommands();
    this.initializeTexts();
    this.instance.launch();
  };

  static greetCallback = async (ctx: Context) => {
    const user = (ctx.message as Message.TextMessage).from!;
    await UsersController.createUser(user);

    if (user.username === "iWallas") {
      ctx.reply("Waldo come verga");
      return;
    }
    ctx.reply(getGreetingMessage(user.first_name));
  };

  static subscribeToRate = async (rateName: RatesNameValue, from: User) => {
    await UsersController.handleSubscribeToRate(from, rateName);
    const rateParsed = rateNameParser[rateName as keyof typeof rateNameParser];
    LoggerService.saveInfoLog(`${from?.first_name} suscribed to ${rateName}`);
    return `Suscripcion a ${rateParsed} exitosa\nRecibira actualizacion en el horario de mercado, y si el valor modifica`;
  };

  static unsuscribeFromRate = async (rateName: RatesNameValue, from: User) => {
    await UsersController.handleUnubscribeToRate(from.id, rateName);
    const rateParsed = rateNameParser[rateName as keyof typeof rateNameParser];
    LoggerService.saveInfoLog(
      `${from?.first_name} unsuscribed from ${rateName}`
    );
    return `Desuscripcion a ${rateParsed} exitosa`;
  };

  static getRateCommand = async (ctx: Context, name: RatesNameValue) => {
    const rate = await RateService.getRate(name);

    if (!rate) {
      ctx.reply("Hubo un problema, intente mas tarde");
      return;
    }
    const rateFormatted = formatRateToMessage(rate);
    ctx.reply(rateFormatted);
    LoggerService.saveInfoLog(`${ctx.from?.first_name} requested ${name} rate`);
  };

  static getSubscriptions = async (ctx: Context) => {
    const userId = ctx.from?.id;
    const subs = await UsersController.getSubscriptions(userId!);
    const subsmessage = formatSubsMessage(subs);

    ctx.replyWithMarkdownV2(subsmessage, { parse_mode: "HTML" });
  };

  static subscribeCallback = async (
    ctx: Context,
    type: "subscribe" | "desuscribe"
  ) => {
    const message =
      type === "subscribe"
        ? "A cual desea suscribirse?"
        : "De cual desea desuscribirse";

    const markup = Markup.inlineKeyboard(getInlineKeyboardOptions(), {
      columns: 2,
    });
    await ctx.reply(message, {
      parse_mode: "HTML",
      ...markup,
    });
  };

  static subscriptionCommandHandler = async (ctx: Context) => {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const subRate = callbackQuery.data;
    const from = callbackQuery.from;
    const originalMessage = (callbackQuery.message as Message.TextMessage).text;

    const isSubscription = !originalMessage.includes("desuscribirse");

    try {
      let message = "";
      if (isSubscription) {
        message = await this.subscribeToRate(subRate as RatesNameValue, from);
      } else {
        message = await this.unsuscribeFromRate(
          subRate as RatesNameValue,
          from
        );
      }

      ctx.reply(message);
    } catch (e) {
      await ctx.reply((e as Error).message);
    } finally {
      ctx.answerCbQuery();
      ctx.editMessageReplyMarkup(undefined);
    }
  };

  static initializeCommands = () => {
    this.instance.command("start", this.greetCallback);
    this.instance.command("subscribe", (ctx: Context) =>
      this.subscribeCallback(ctx, "subscribe")
    );
    this.instance.command("unsubscribe", (ctx: Context) =>
      this.subscribeCallback(ctx, "desuscribe")
    );

    ratesNames.forEach((v) =>
      this.instance.command(v, (ctx: Context) => this.getRateCommand(ctx, v))
    );

    this.instance.command("my_subscriptions", this.getSubscriptions);
  };

  static initializeTexts = () => {
    this.instance.on(message("text"), this.greetCallback);
    this.instance.on(callbackQuery("data"), this.subscriptionCommandHandler);
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
