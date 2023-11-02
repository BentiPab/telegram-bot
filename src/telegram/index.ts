import { Context } from "telegraf";
import {
  GREETING_MESSAGE,
  formatData,
  getGreetingMessage,
} from "../utils/formater";
import { message } from "telegraf/filters";
import { SubscriberController } from "../controller/subscriberController";
import { ISubscriber } from "../mongo/models/subscriber";
import { getRate } from "../services/rate";
import { RatesNameKey, RatesNamesMap } from "../model";

const { Telegraf } = require("telegraf");

type Command = {
  [k: string]: (ctx: Context) => Promise<void> | void;
};

const bot: typeof Telegraf = new Telegraf(process.env.BOT_TOKEN);

const sendMessage = (ctx: Context, message: string) => {
  ctx.telegram.sendMessage(ctx.chat?.id!, message);
};
const subscribeCallback = async (ctx: Context) => {
  const sub = ctx.chat as unknown as ISubscriber;

  const res = await SubscriberController.createSubscriber(sub);
  let message = "Suscripcion exitosa";
  if (!res) {
    message = "Suscriptor ya registrado";
  }
  sendMessage(ctx, message);
};

const greetCallback = (ctx: Context) => {
  const chat = ctx.chat as ISubscriber;

  if (chat.username === "iWaldo") {
    sendMessage(ctx, "Waldo come verga");
    return;
  }
  sendMessage(ctx, getGreetingMessage(chat.first_name));
};

const unsubscribeCallback = async (ctx: Context) => {
  const sub = ctx.chat as unknown as ISubscriber;
  const res = await SubscriberController.deleteSubscriber(sub.id);
  let message = "Desuscripcion exitosa";

  if (!res) {
    message = "Suscriptor no encontrado";
  }
  sendMessage(ctx, message);
};

const getRateCommand = async (ctx: Context, name: string) => {
  const rate = await getRate(name);

  if (!rate) {
    ctx.telegram.sendMessage(
      ctx.chat?.id!,
      "Hubo un problema, intente mas tarde"
    );
    return;
  }
  const rateFormatted = formatData(rate);
  sendMessage(ctx, rateFormatted);
};
const commands: Command = {
  start: greetCallback,
  subscribe: subscribeCallback,
  unsubscribe: unsubscribeCallback,
};

const initializeCommands = () => {
  Object.keys(commands).forEach((k) => bot.command(k, commands[k]));

  Object.values(RatesNamesMap).forEach((v) =>
    bot.command(v, (ctx: Context) => getRateCommand(ctx, v))
  );
};

const initializeTexts = () => {
  bot.on(message("text"), greetCallback);
};

export const sendDollarUpdated = (chatId: number, message: string) => {
  bot.telegram.sendMessage(chatId, message);
};

const initBot = () => {
  initializeCommands();
  initializeTexts();
  bot.launch();
};

initBot();
