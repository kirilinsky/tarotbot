import { Telegraf, session } from "telegraf";
import { BotContext } from "./types/session";
import { cleanEnv } from "./utils/cleanEnv";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing in environment!");
  process.exit(1);
}

export const bot = new Telegraf<BotContext>(cleanEnv(process.env.BOT_TOKEN!));

bot.use(session());
