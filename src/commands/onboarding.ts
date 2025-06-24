import { bot } from "../bot";
import { supabase } from "../supabase";

const GENDERS: Record<string, string> = {
  Мужской: "male",
  Женский: "female",
};

bot.hears(Object.keys(GENDERS), async (ctx) => {
  const gender = GENDERS[ctx.message.text];
  const telegramId = ctx.from.id.toString();

  await supabase.from("users").update({ gender }).eq("telegram_id", telegramId);

  await ctx.reply(`🎂 Теперь выбери возрастную группу:`, {
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

  await ctx.reply(`🎯 Что для тебя сейчас важнее всего?`, {
    reply_markup: {
      keyboard: [
        [{ text: "Любовь" }, { text: "Работа" }],
        [{ text: "Саморазвитие" }, { text: "Финансы" }],
        [{ text: "Семья" }, { text: "Здоровье" }],
        [{ text: "Другое" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

const FOCUS_AREAS: Record<string, string> = {
  Любовь: "love",
  Работа: "career",
  Саморазвитие: "self",
  Финансы: "money",
  Семья: "family",
  Здоровье: "health",
  Другое: "other",
};

bot.hears(Object.keys(FOCUS_AREAS), async (ctx) => {
  const focusArea = FOCUS_AREAS[ctx.message.text];
  const telegramId = ctx.from.id.toString();

  await supabase
    .from("users")
    .update({ focus_area: focusArea })
    .eq("telegram_id", telegramId);

  await ctx.reply("🌱 Как ты чувствуешь себя сейчас, в каком ты этапе жизни?", {
    reply_markup: {
      keyboard: [
        [{ text: "В поиске себя" }, { text: "Переживаю трудности" }],
        [{ text: "Всё стабильно" }, { text: "Готов(а) к переменам" }],
        [{ text: "Влюблён(а)" }],
        [{ text: "Неопределённость" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

const LIFE_PHASES: Record<string, string> = {
  "В поиске себя": "searching",
  "Переживаю трудности": "crisis",
  "Всё стабильно": "stable",
  "Готов(а) к переменам": "transition",
  "Влюблён(а)": "in_love",
  Неопределённость: "uncertain",
};

bot.hears(Object.keys(LIFE_PHASES), async (ctx) => {
  const lifePhase = LIFE_PHASES[ctx.message.text];
  const telegramId = ctx.from.id.toString();

  await supabase
    .from("users")
    .update({ life_phase: lifePhase })
    .eq("telegram_id", telegramId);

  await ctx.reply("💞 Ты сейчас сингл или в отношениях?", {
    reply_markup: {
      keyboard: [[{ text: "Сингл" }, { text: "В отношениях" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

const RELATIONSHIP_STATUSES: Record<string, string> = {
  Сингл: "single",
  "В отношениях": "in_relationship",
};

bot.hears(Object.keys(RELATIONSHIP_STATUSES), async (ctx) => {
  const relationshipStatus = RELATIONSHIP_STATUSES[ctx.message.text];
  const telegramId = ctx.from.id.toString();

  await supabase
    .from("users")
    .update({ relationship_status: relationshipStatus })
    .eq("telegram_id", telegramId);

  await ctx.reply(
    "Спасибо! ✨ Ты полностью настроен(а). Напиши /daily, чтобы получить карту дня 🃏",
    {
      reply_markup: { remove_keyboard: true },
    }
  );
});
