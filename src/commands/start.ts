import { bot } from "../bot";
import { getOrCreateUser } from "../utils/users";
import { sendDailyReading } from "./daily";
import { Markup } from "telegraf";

bot.start(async (ctx) => {
  const { user, isNew } = await getOrCreateUser(ctx.from);

  if (isNew || !user.gender || !user.age_group || !user.zodiac_sign) {
    if (isNew) {
      await ctx.reply(
        `Привет, ${ctx.from.first_name || "друг"} ✨\n\n` +
        `Я — твой персональный таро-гид.\n\n` +
        `Каждый день я буду вытягивать для тебя карту и давать короткое послание — ` +
        `о том, что сейчас важно, куда смотреть и чего ждать.\n\n` +
        `🃏 *Карта дня* — бесплатно, раз в день\n` +
        `🔮 *Полный расклад* — развёрнутый AI-прогноз на подписке\n\n` +
        `Чтобы послания были точными — сначала расскажи немного о себе.\n` +
        `Это займёт меньше минуты 👇`,
        { parse_mode: "Markdown" }
      );
    }
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
