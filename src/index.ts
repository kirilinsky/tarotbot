import { Telegraf } from "telegraf";

// Подключаем dotenv только локально
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing in environment!");
  process.exit(1);
}

console.log("✅ BOT_TOKEN loaded, starting bot...");

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply("hello there 🔮"));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
