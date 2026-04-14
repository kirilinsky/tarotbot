import { Telegraf, session, Scenes } from "telegraf";
import { BotContext } from "./types/session";
import { cleanEnv } from "./utils/cleanEnv";
import { onboardingWizard } from "./scenes/onboarding.scene";
import { profileEditScene } from "./scenes/profile-edit.scene";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing in environment!");
  process.exit(1);
}

export const bot = new Telegraf<BotContext>(cleanEnv(process.env.BOT_TOKEN!));

const stage = new Scenes.Stage<BotContext>([
  onboardingWizard,
  profileEditScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.catch((err, ctx) => {
  const e = err as Record<string, unknown>;
  const isDbStarting = e.code === "57P03";
  console.error(`[bot.catch] update=${ctx.updateType}`, err);
  ctx
    .reply(
      isDbStarting
        ? "⏳ Бот, подожди пару секунд и попробуй снова."
        : "Что-то пошло не так. Попробуй ещё раз 🙏",
    )
    .catch(() => {});
});
