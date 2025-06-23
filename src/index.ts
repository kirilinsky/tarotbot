import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply("hello from railways 🔮"));
bot.command("ping", (ctx) => ctx.reply("pong"));

bot.launch();

console.log("Bot is running...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
