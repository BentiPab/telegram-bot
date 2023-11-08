import { Context, Telegraf, Markup } from "telegraf";
import {
  formatRateToMessage,
  formatSubsMessage,
  getGreetingMessage,
  getInlineKeyboardOptions,
  nameParser,
} from "../utils/formater";
import { message, callbackQuery } from "telegraf/filters";
import { getRate } from "../services/rate";
import { RatesNameValue, RatesNamesMap } from "../model";
import {
  CallbackQuery,
  Message,
  User,
} from "telegraf/typings/core/types/typegram";
import { UsersController } from "../controller/userController";
import App from "../app";
import baseConfig from "../config";
import logger from "../logger";

const bot = new Telegraf(baseConfig.Telegram.BotToken);

const subscribeCallback = async (
  ctx: Context,
  type: "subscribe" | "desuscribe"
) => {
  const message =
    type === "subscribe"
      ? "A cual desea suscribirse?"
      : "De cual desea desuscribirse";
  await ctx.reply(message, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard(getInlineKeyboardOptions),
  });
};

const subscriptionCommandHandler = async (ctx: Context) => {
  const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
  const subRate = callbackQuery.data;
  const from = callbackQuery.from;
  const originalMessage = (callbackQuery.message as Message.TextMessage).text;

  const isSubscription = !originalMessage.includes("desuscribirse");

  try {
    let message = "";
    if (isSubscription) {
      message = await subscribeToRate(subRate as RatesNameValue, from);
    } else {
      message = await unsuscribeFromRate(subRate as RatesNameValue, from);
    }

    ctx.reply(message);
  } catch (e) {
    await ctx.reply((e as Error).message);
  } finally {
    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup(undefined);
  }
};

const subscribeToRate = async (rateName: RatesNameValue, from: User) => {
  await UsersController.handleSubscribeToRate(from, rateName);
  const rateParsed = nameParser[rateName as keyof typeof nameParser];
  logger.log("info", `${from?.first_name} suscribed to ${rateName}`);
  return `Suscripcion a ${rateParsed} exitosa\nRecibira actualizacion en el horario de mercado, y si el valor modifica`;
};

const unsuscribeFromRate = async (rateName: RatesNameValue, from: User) => {
  await UsersController.handleUnubscribeToRate(from.id, rateName);
  const rateParsed = nameParser[rateName as keyof typeof nameParser];
  logger.log("info", `${from?.first_name} unsuscribed from ${rateName}`);
  return `Desuscripcion a ${rateParsed} exitosa`;
};

const greetCallback = async (ctx: Context) => {
  const user = (ctx.message as Message.TextMessage).from!;
  try {
    await UsersController.createUser(user);
  } catch (e) {}

  if (user.username === "iWallas") {
    ctx.reply("Waldo come verga");
    return;
  }
  ctx.reply(getGreetingMessage(user.first_name));
};

const getRateCommand = async (ctx: Context, name: string) => {
  const rate = await getRate(name);

  if (!rate) {
    ctx.reply("Hubo un problema, intente mas tarde");
    return;
  }
  const rateFormatted = formatRateToMessage(rate);
  ctx.reply(rateFormatted);
  logger.log("info", `${ctx.from?.first_name} requested ${name} rate`);
};

const getSubscriptions = async (ctx: Context) => {
  const userId = ctx.from?.id;
  const subs = await UsersController.getSubscriptions(userId!);
  const subsmessage = formatSubsMessage(subs);

  ctx.replyWithMarkdownV2(subsmessage, { parse_mode: "HTML" });
};

const initializeCommands = () => {
  bot.command("start", greetCallback);
  bot.command("subscribe", (ctx: Context) =>
    subscribeCallback(ctx, "subscribe")
  );
  bot.command("unsubscribe", (ctx: Context) =>
    subscribeCallback(ctx, "desuscribe")
  );

  Object.values(RatesNamesMap).forEach((v) =>
    bot.command(v, (ctx: Context) => getRateCommand(ctx, v))
  );

  bot.command("mySubscriptions", getSubscriptions);
};

const initializeTexts = () => {
  bot.on(message("text"), greetCallback);
  bot.on(callbackQuery("data"), subscriptionCommandHandler);
};

export const sendRateUpdates = async (chatId: number, message: string) => {
  await bot.telegram.sendMessage(chatId, message);
};

const initBot = () => {
  App.getInstance()
    .getServer()
    ?.use(bot.webhookCallback(baseConfig.App.WebhookPath));
  initializeCommands();
  initializeTexts();

  if (baseConfig.App.Env === "production") {
    bot.telegram.setWebhook(baseConfig.App.WebhookUrl);
  }
  bot.launch();
};

initBot();

export default bot;
