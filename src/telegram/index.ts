import { Context, Telegraf, Markup } from "telegraf";
import {
  formatRateToMessage,
  getGreetingMessage,
  getInlineKeyboardOptions,
  nameParser,
} from "../utils/formater";
import { message, callbackQuery } from "telegraf/filters";
import { getRate } from "../services/rate";
import { RatesNamesMap } from "../model";
import {
  CallbackQuery,
  Message,
  User,
} from "telegraf/typings/core/types/typegram";
import { RateController } from "../controller/rateContoller";

const bot = new Telegraf(process.env.BOT_TOKEN!);

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
  let message = "";

  if (isSubscription) {
    message = await subscribeToRate(subRate, from);
  } else {
    message = await unsuscribeFromRate(subRate, from);
  }

  ctx.answerCbQuery();
  ctx.editMessageReplyMarkup(undefined);
  ctx.reply(message);
};

const subscribeToRate = async (rateName: string, from: User) => {
  const res = await RateController.subscribeToRate(rateName, from);
  const rateParsed = nameParser[rateName as keyof typeof nameParser];

  return !res
    ? `Suscriptor ya suscrito a ${rateParsed}`
    : `Suscripcion a ${rateParsed} exitosa\nRecibira actualizacion en el horario de mercado, y si el valor modifica`;
};

const unsuscribeFromRate = async (rateName: string, from: User) => {
  const res = await RateController.unsubscribeFromRate(rateName, from);
  const rateParsed = nameParser[rateName as keyof typeof nameParser];

  return !res
    ? `Suscriptor no suscrito a ${rateParsed}`
    : `Desuscripcion a ${rateParsed} exitosa`;
};

const greetCallback = (ctx: Context) => {
  const user = (ctx.message as Message.TextMessage).from!;

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
};

const initializeTexts = () => {
  bot.on(message("text"), greetCallback);
  bot.on(callbackQuery("data"), subscriptionCommandHandler);
};

export const sendRateUpdates = (chatId: number, message: string) => {
  bot.telegram.sendMessage(chatId, message);
};

const initBot = () => {
  initializeCommands();
  initializeTexts();
  bot.launch();
};

initBot();
