import express from "express";
import bot from "../telegram";
import bodyParser from "body-parser";

const app = express();

app.get("/", (req, res) => {
  res.send("Working!!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bot.webhookCallback("/secret-path"));

app.post(process.env.WEBHOOK_PATH!, (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
