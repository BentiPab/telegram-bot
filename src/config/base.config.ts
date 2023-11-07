import dotenv from "dotenv";
import dotenv_expand from "dotenv-expand";
import fs from "fs";
import path from "path";

const dotenvPath: string = path.resolve(".env");
const dotenvFiles: string[] = [`${dotenvPath}.local`, dotenvPath];

dotenvFiles.forEach((dotenvFile: string) => {
  if (fs.existsSync(dotenvFile)) {
    dotenv_expand.expand(
      dotenv.config({
        path: dotenvFile,
      })
    );
  }
});

const safeEnv = (key: string, defaultValue?: string): string => {
  const value: string = process.env[key] || "";
  const result: any = value || defaultValue;

  // strict check because empty string must be evaluated as true
  if (result === undefined) {
    throw new Error(`Missing key in in .env file: ${key}`);
  }
  return result;
};

const mongoConfig = {
  Url: safeEnv("MONGO_URL"),
  DbName: safeEnv("MONGO_DB_NAME", ""),
};

const appConfig = {
  AmbitoUrl: safeEnv("AMBITO_URL"),
  Url: safeEnv("URL"),
  WebhookPath: safeEnv("WEBHOOK_PATH"),
  WebhookUrl: `${safeEnv("URL")}/${safeEnv("WEBHOOK_PATH")}`,
  Env: safeEnv("NODE_ENV"),
};

const telegramConfig = {
  BotToken: safeEnv("BOT_TOKEN"),
};

const config = {
  App: appConfig,
  Mongo: mongoConfig,
  Port: Number(safeEnv("PORT")),
  Telegram: telegramConfig,
};

export default config;
