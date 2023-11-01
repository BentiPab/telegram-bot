import { Context } from "telegraf";
import { ResTypeWithAvg } from "../model";
import { getDollarRate } from "../services/dolar";
import { formatData } from "../utils/formater";
import Dolar from "../class/dolar";
import dolar from "../class/dolar";

const { Telegraf } = require("telegraf");

const bot: typeof Telegraf = new Telegraf(process.env.BOT_TOKEN);

bot.command("dolar", async (ctx: Context) => {
  const rate = await getDollarRate();
  const rateFormatted = formatData(rate);
  dolar.setLastAvg(rate.avg);
  ctx.telegram.sendMessage(ctx.chat?.id!, rateFormatted);
});

export const sendDollarUpdated = (message: string) => {
  bot.telegram.sendMessage(6677122686, message);
};

bot.launch();
