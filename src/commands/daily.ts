import { bot } from "../bot";
import { supabase } from "../supabase";
import { getNarrativeForecast } from "../utils/get_forecast";

bot.command("daily", async (ctx) => {
  const telegramId = ctx.from.id.toString();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (!user || !user.gender || !user.age_group) {
    return ctx.reply("Сначала нужно пройти /start и настроить профиль 🧙");
  }

  const cardResult = getNarrativeForecast(user);

  await ctx.reply(cardResult.text, { parse_mode: "Markdown" });

  await supabase.from("readings").insert({
    user_id: telegramId,
    timestamp: new Date().toISOString(),
    type: "free",
    theme: "daily",
    cards: [{ id: cardResult.cardId, position: cardResult.position }],
    summary: cardResult.text,
    paid: false,
  });

  await supabase
    .from("users")
    .update({
      last_card_pull: {
        date: new Date().toISOString(),
        type: "free",
        cards: [{ id: cardResult.cardId, position: cardResult.position }],
        summary: cardResult.text,
      },
      total_free_readings: (user.total_free_readings || 0) + 1,
    })
    .eq("telegram_id", telegramId);
});
