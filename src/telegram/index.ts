import { getDollarRate } from "../services/dolar";
import server from "../app";

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const port = parseInt(process.env.PORT || "3000");
const domain = process.env.DEPLOY_URL;
const path = process.env.DEPLOY_PATH;

const webhook = async () => await bot.createWebhook({ domain });

server.post(`/telegraf/${bot.secretPathComponent()}`, async () => webhook());

bot.command("dolar", async () => {
  const rate = await getDollarRate();
  Telegraf.reply(rate);
});

server
  .listen({ port: port })
  .then(() => console.log("Listening on port", port));
