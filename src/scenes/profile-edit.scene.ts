import { Scenes, Markup } from "telegraf";
import { BotContext } from "../types/session";
import { sql } from "../db";

const OPTIONS: Record<
  string,
  {
    label: string;
    values: string[];
    map: Record<string, string>;
    columns?: number;
  }
> = {
  gender: {
    label: "Выбери пол:",
    values: ["Мужской", "Женский"],
    map: { Мужской: "male", Женский: "female" },
  },
  age_group: {
    label: "Выбери возрастную группу:",
    values: ["до 18", "18–25", "26–35", "36–45", "46–60", "60+"],
    map: {
      "до 18": "under_18",
      "18–25": "18_25",
      "26–35": "26_35",
      "36–45": "36_45",
      "46–60": "46_60",
      "60+": "60_plus",
    },
  },
  focus_area: {
    label: "Что для тебя сейчас важнее всего?",
    values: [
      "Любовь",
      "Работа",
      "Саморазвитие",
      "Финансы",
      "Семья",
      "Здоровье",
      "Другое",
    ],
    map: {
      Любовь: "love",
      Работа: "career",
      Саморазвитие: "self",
      Финансы: "money",
      Семья: "family",
      Здоровье: "health",
      Другое: "other",
    },
  },
  life_phase: {
    label: "В каком ты сейчас жизненном этапе?",
    values: [
      "В поиске себя",
      "Переживаю трудности",
      "Всё стабильно",
      "Готов(а) к переменам",
      "Влюблён(а)",
      "Неопределённость",
    ],
    map: {
      "В поиске себя": "searching",
      "Переживаю трудности": "crisis",
      "Всё стабильно": "stable",
      "Готов(а) к переменам": "transition",
      "Влюблён(а)": "in_love",
      Неопределённость: "uncertain",
    },
  },
  relationship_status: {
    label: "Твой статус отношений:",
    values: ["Сингл", "В отношениях", "Всё сложно"],
    map: {
      Сингл: "single",
      "В отношениях": "in_relationship",
      "Всё сложно": "complicated",
    },
  },
  zodiac_sign: {
    label: "Твой знак зодиака:",
    values: [
      "Овен ♈",
      "Телец ♉",
      "Близнецы ♊",
      "Рак ♋",
      "Лев ♌",
      "Дева ♍",
      "Весы ♎",
      "Скорпион ♏",
      "Стрелец ♐",
      "Козерог ♑",
      "Водолей ♒",
      "Рыбы ♓",
    ],
    map: {
      "Овен ♈": "aries",
      "Телец ♉": "taurus",
      "Близнецы ♊": "gemini",
      "Рак ♋": "cancer",
      "Лев ♌": "leo",
      "Дева ♍": "virgo",
      "Весы ♎": "libra",
      "Скорпион ♏": "scorpio",
      "Стрелец ♐": "sagittarius",
      "Козерог ♑": "capricorn",
      "Водолей ♒": "aquarius",
      "Рыбы ♓": "pisces",
    },
    columns: 3,
  },
};

const DB_FIELD: Record<string, string> = {
  gender: "gender",
  age_group: "age_group",
  focus_area: "focus_area",
  life_phase: "life_phase",
  relationship_status: "relationship_status",
  zodiac_sign: "zodiac_sign",
};

function keyboard(values: string[], columns = 2) {
  const rows: { text: string }[][] = [];
  for (let i = 0; i < values.length; i += columns) {
    rows.push(values.slice(i, i + columns).map((text) => ({ text })));
  }
  return Markup.keyboard(rows).resize().oneTime();
}

export const profileEditScene = new Scenes.WizardScene<BotContext>(
  "profile_edit",

  async (ctx) => {
    const field = (ctx.wizard.state as { field?: string }).field;
    const option = field && OPTIONS[field];

    if (!option) {
      await ctx.reply("Что-то пошло не так. Попробуй ещё раз.");
      return ctx.scene.leave();
    }

    await ctx.reply(option.label, keyboard(option.values, option.columns));
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (!ctx.message || !("text" in ctx.message)) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }

    const field = (ctx.wizard.state as { field?: string }).field!;
    const option = OPTIONS[field];

    if (!option.values.includes(ctx.message.text)) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }

    const dbValue = option.map[ctx.message.text];
    const telegramId = ctx.from!.id.toString();

    await sql`UPDATE users SET ${sql(DB_FIELD[field])} = ${dbValue} WHERE telegram_id = ${telegramId}`;

    await ctx.reply("✅ Обновлено!", Markup.removeKeyboard());
    await ctx.reply(
      "Что делаем дальше?",
      Markup.inlineKeyboard([
        [Markup.button.callback("🃏 Карта дня", "daily")],
        [Markup.button.callback("✨ Полный расклад", "buy_full_reading")],
        [Markup.button.callback("⚙️ Настройки", "settings")],
      ]),
    );

    return ctx.scene.leave();
  },
);
