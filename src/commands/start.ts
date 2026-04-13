import { bot } from "../bot";
import { getOrCreateUser } from "../utils/users";
import { sendDailyReading } from "./daily";
import { Markup } from "telegraf";

bot.start(async (ctx) => {
  const { user, isNew } = await getOrCreateUser(ctx.from);

  if (isNew || !user.gender || !user.age_group || !user.zodiac_sign) {
    await ctx.scene.enter("onboarding");
  } else {
    await ctx.reply(
      `Привет, ${user.first_name || "друг"} 🔮\n\nЧто делаем?`,
      Markup.inlineKeyboard([
        [Markup.button.callback("🃏 Карта дня", "daily")],
        [Markup.button.callback("✨ Полный расклад", "buy_full_reading")],
      ])
    );
  }
});

bot.action("daily", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  await sendDailyReading(ctx, ctx.from!.id.toString());
});
