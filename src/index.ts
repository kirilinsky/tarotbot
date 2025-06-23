import { bot } from "./bot";
import "./commands/start";
import "./commands/onboarding";



console.log("✅ BOT_TOKEN loaded, starting bot...");
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
