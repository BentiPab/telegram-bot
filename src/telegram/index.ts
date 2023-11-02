import { Context } from "telegraf";
import {
  GREETING_MESSAGE,
  formatData,
  getGreetingMessage,
} from "../utils/formater";
import { message } from "telegraf/filters";
import { SubscriberController } from "../controller/subscriberController";
import { ISubscriber } from "../mongo/models/subscriber";
import { RateController } from "../controller/rateContoller";

const { Telegraf } = require("telegraf");

type Command = {
  [k: string]: (ctx: Context) => Promise<void> | void;
};

const bot: typeof Telegraf = new Telegraf(process.env.BOT_TOKEN);

const sendMessage = (ctx: Context, message: string) => {
  ctx.telegram.sendMessage(ctx.chat?.id!, message);
};

const dollarCallback = async (ctx: Context) => {
  const rate = await RateController.getRate("dolar");

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

const subscribeCallback = async (ctx: Context) => {
  const sub = ctx.chat as unknown as ISubscriber;

  const res = await SubscriberController.createSubscriber(sub);
  sendMessage(ctx, res);
};

const greetCallback = (ctx: Context) => {
  const chat = ctx.chat as ISubscriber;
  sendMessage(ctx, getGreetingMessage(chat.first_name));
};

const unsubscribeCallback = async (ctx: Context) => {
  const sub = ctx.chat as unknown as ISubscriber;

  const res = await SubscriberController.deleteSubscriber(sub.id);
  sendMessage(ctx, res);
};

const commands: Command = {
  dolar: dollarCallback,
  start: greetCallback,
  subscribe: subscribeCallback,
  unsubscribeCallback: unsubscribeCallback,
};

const initializeCommands = () => {
  Object.keys(commands).forEach((k) => bot.command(k, commands[k]));
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
