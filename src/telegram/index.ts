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

const bot: typeof Telegraf = new Telegraf(process.env.BOT_TOKEN);

bot.command("dolar", async (ctx: Context) => {
  const rate = await RateController.getRate("dolar");

  if (!rate) {
    ctx.telegram.sendMessage(
      ctx.chat?.id!,
      "Hubo un problema, intente mas tarde"
    );
    return;
  }
  const rateFormatted = formatData(rate);
  ctx.telegram.sendMessage(ctx.chat?.id!, rateFormatted);
});

bot.command("start", async (ctx: Context) => {
  sendGreetMessage(ctx);
});

bot.command("subscribe", async (ctx: Context) => {
  const sub = ctx.chat as unknown as ISubscriber;

  const res = await SubscriberController.createSubscriber(sub);

  ctx.telegram.sendMessage(ctx.chat?.id!, res);
});
bot.command("unsubscribe", async (ctx: Context) => {
  const sub = ctx.chat as unknown as ISubscriber;

  const res = await SubscriberController.deleteSubscriber(sub.id);

  ctx.telegram.sendMessage(ctx.chat?.id!, res);
});
bot.on(message("text"), async (ctx: Context) => {
  sendGreetMessage(ctx);
});

export const sendDollarUpdated = (chatId: number, message: string) => {
  bot.telegram.sendMessage(chatId, message);
};

const sendGreetMessage = (ctx: Context) => {
  const chat = ctx.chat as ISubscriber;
  ctx.telegram.sendMessage(chat.id, getGreetingMessage(chat.first_name));
};

bot.launch();
