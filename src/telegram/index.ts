import { Context } from "telegraf";
import { ResTypeWithAvg } from "../model";
import { getDollarRate } from "../services/dolar";
import { formatData } from "../utils/formater";

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("dolar", async (ctx: Context) => {
  const rate = await getDollarRate();
  const rateFormatted = formatData(rate);
  ctx.telegram.sendMessage(ctx.chat?.id!, rateFormatted);
});

export const sendDollarUpdated = (message: string) => {
  bot.sendMessage(6549316187, message);
};

bot.launch();
