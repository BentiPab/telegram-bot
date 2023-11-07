import express from "express";
import bot from "../src/telegram";
import bodyParser from "body-parser";
import logger from "../src/logger";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bot.webhookCallback(`/api/${process.env.WEBHOOK_PATH!}`));
app.get("/api", (req, res) => {
  res.send(bot.telegram.getWebhookInfo());
  res.send("Working!!");
});

app.post(`/api/${process.env.WEBHOOK_PATH!}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Running on port ${process.env.PORT || 3000}`);
});
