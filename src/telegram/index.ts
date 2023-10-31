import { getDollarRate } from "../services/dolar";
import server from "../app";

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const port = process.env.PORT || 3000;
const domain = process.env.DEPLOY_URL;
const path = process.env.DEPLOY_PATH;

bot.command("dolar", async () => {
  const rate = await getDollarRate();
  Telegraf.reply(rate);
});

console.log(port, path, domain);

bot.launch({
  webhook: {
    domain: domain,
    port: port,
    path: path,
  },
});
