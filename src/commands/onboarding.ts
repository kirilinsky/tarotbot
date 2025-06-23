import { bot } from "../bot";
import { supabase } from "../supabase";

const GENDERS: Record<string, string> = {
  Мужской: "male",
  Женский: "female",
  Другой: "other",
};

bot.hears(Object.keys(GENDERS), async (ctx) => {
  const gender = GENDERS[ctx.message.text];
  const telegramId = ctx.from.id.toString();

  await supabase.from("users").update({ gender }).eq("telegram_id", telegramId);

  await ctx.reply(`Теперь выбери возрастную группу:`, {
    reply_markup: {
      keyboard: [
        [{ text: "до 18" }, { text: "18–25" }],
        [{ text: "26–35" }, { text: "36–45" }],
        [{ text: "46–60" }, { text: "60+" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

const AGE_GROUPS: Record<string, string> = {
  "до 18": "under_18",
  "18–25": "18_25",
  "26–35": "26_35",
  "36–45": "36_45",
  "46–60": "46_60",
  "60+": "60_plus",
};

bot.hears(Object.keys(AGE_GROUPS), async (ctx) => {
  const ageGroup = AGE_GROUPS[ctx.message.text];
  const telegramId = ctx.from.id.toString();

  await supabase
    .from("users")
    .update({ age_group: ageGroup })
    .eq("telegram_id", telegramId);

  await ctx.reply(`Спасибо! Ты готов к своему первому раскладу 🃏`, {
    reply_markup: { remove_keyboard: true },
  });
});
