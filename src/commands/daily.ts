import { bot } from "../bot";
import { supabase } from "../supabase";
import { getNarrativeForecast } from "../utils/get_forecast";
import { isSameDay } from "date-fns";

bot.command("daily", async (ctx) => {
  const telegramId = ctx.from.id.toString();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (error || !user) {
    console.error("Ошибка при получении пользователя:", error);
    return ctx.reply("Произошла ошибка при получении профиля.");
  }

  if (!user.gender || !user.age_group) {
    return ctx.reply("Сначала нужно пройти /start и настроить профиль 🧙");
  }

  const lastDate = user.last_card_pull?.date;
  const alreadyToday = lastDate && isSameDay(new Date(lastDate), new Date());

  if (alreadyToday) {
    return ctx.reply(
      "Ты уже получал(а) карту сегодня 🌞 Попробуй снова завтра!",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔮 Купить полный расклад",
                callback_data: "buy_full_reading",
              },
            ],
          ],
        },
      }
    );
  }

  const cardResult = getNarrativeForecast(user);
  await ctx.reply(cardResult.text, { parse_mode: "Markdown" });

  const timestamp = new Date().toISOString();

  await supabase.from("readings").insert({
    user_id: telegramId,
    timestamp,
    type: "free",
    theme: "daily",
    cards: [{ id: cardResult.cardId, position: cardResult.position }],
    summary: cardResult.summary,
    paid: false,
  });

  await supabase
    .from("users")
    .update({
      last_card_pull: {
        date: timestamp,
        type: "free",
        cards: [{ id: cardResult.cardId, position: cardResult.position }],
        summary: cardResult.summary,
      },
      total_free_readings: (user.total_free_readings || 0) + 1,
    })
    .eq("telegram_id", telegramId);
});

bot.on("callback_query", async (ctx) => {
  if ("data" in ctx.callbackQuery) {
    const data = ctx.callbackQuery.data;
    if (data === "buy_full_reading") {
      await ctx.answerCbQuery();
      await ctx.reply(
        "✨ Эта функция в разработке. Совсем скоро ты сможешь узнать всё!"
      );
    }
  }
});
