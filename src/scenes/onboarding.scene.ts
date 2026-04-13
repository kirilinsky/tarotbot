import { Scenes, Markup } from "telegraf";
import { BotContext } from "../types/session";
import { sql } from "../db";

const GENDERS = ["Мужской", "Женский"];
const AGE_GROUPS = ["до 18", "18–25", "26–35", "36–45", "46–60", "60+"];
const FOCUS_AREAS = [
  "Любовь",
  "Работа",
  "Саморазвитие",
  "Финансы",
  "Семья",
  "Здоровье",
  "Другое",
];
const LIFE_PHASES = [
  "В поиске себя",
  "Переживаю трудности",
  "Всё стабильно",
  "Готов(а) к переменам",
  "Влюблён(а)",
  "Неопределённость",
];
const RELATIONSHIP_STATUSES = ["Сингл", "В отношениях", "Всё сложно"];
const ZODIAC_SIGNS = [
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
];
const ZODIAC_MAP: Record<string, string> = {
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
};

const GENDER_MAP: Record<string, string> = {
  Мужской: "male",
  Женский: "female",
};
const AGE_MAP: Record<string, string> = {
  "до 18": "under_18",
  "18–25": "18_25",
  "26–35": "26_35",
  "36–45": "36_45",
  "46–60": "46_60",
  "60+": "60_plus",
};
const FOCUS_MAP: Record<string, string> = {
  Любовь: "love",
  Работа: "career",
  Саморазвитие: "self",
  Финансы: "money",
  Семья: "family",
  Здоровье: "health",
  Другое: "other",
};
const LIFE_PHASE_MAP: Record<string, string> = {
  "В поиске себя": "searching",
  "Переживаю трудности": "crisis",
  "Всё стабильно": "stable",
  "Готов(а) к переменам": "transition",
  "Влюблён(а)": "in_love",
  Неопределённость: "uncertain",
};
const RELATIONSHIP_MAP: Record<string, string> = {
  Сингл: "single",
  "В отношениях": "in_relationship",
  "Всё сложно": "complicated",
};

function keyboard(buttons: string[], columns = 2) {
  const rows: { text: string }[][] = [];
  for (let i = 0; i < buttons.length; i += columns) {
    rows.push(buttons.slice(i, i + columns).map((text) => ({ text })));
  }
  return Markup.keyboard(rows).resize().oneTime();
}

type State = {
  gender?: string;
  age_group?: string;
  focus_area?: string;
  life_phase?: string;
  relationship_status?: string;
};

export const onboardingWizard = new Scenes.WizardScene<BotContext>(
  "onboarding",

   async (ctx) => {
    await ctx.reply(
      "Привет! Давай настроим твой профиль 💫\n\nВыбери свой пол:",
      keyboard(GENDERS),
    );
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (
      !ctx.message ||
      !("text" in ctx.message) ||
      !GENDERS.includes(ctx.message.text)
    ) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }
    (ctx.wizard.state as State).gender = GENDER_MAP[ctx.message.text];
    await ctx.reply("🎂 Выбери свою возрастную группу:", keyboard(AGE_GROUPS));
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (
      !ctx.message ||
      !("text" in ctx.message) ||
      !AGE_GROUPS.includes(ctx.message.text)
    ) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }
    (ctx.wizard.state as State).age_group = AGE_MAP[ctx.message.text];
    await ctx.reply(
      "🎯 Что для тебя сейчас важнее всего?",
      keyboard(FOCUS_AREAS),
    );
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (
      !ctx.message ||
      !("text" in ctx.message) ||
      !FOCUS_AREAS.includes(ctx.message.text)
    ) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }
    (ctx.wizard.state as State).focus_area = FOCUS_MAP[ctx.message.text];
    await ctx.reply(
      "🌱 В каком ты сейчас жизненном этапе?",
      keyboard(LIFE_PHASES),
    );
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (
      !ctx.message ||
      !("text" in ctx.message) ||
      !LIFE_PHASES.includes(ctx.message.text)
    ) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }
    (ctx.wizard.state as State).life_phase = LIFE_PHASE_MAP[ctx.message.text];
    await ctx.reply(
      "💞 Ты сейчас сингл или в отношениях?",
      keyboard(RELATIONSHIP_STATUSES),
    );
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (
      !ctx.message ||
      !("text" in ctx.message) ||
      !RELATIONSHIP_STATUSES.includes(ctx.message.text)
    ) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }
    (ctx.wizard.state as State).relationship_status =
      RELATIONSHIP_MAP[ctx.message.text];
    await ctx.reply("♈ Твой знак зодиака?", keyboard(ZODIAC_SIGNS, 3));
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (
      !ctx.message ||
      !("text" in ctx.message) ||
      !ZODIAC_SIGNS.includes(ctx.message.text)
    ) {
      await ctx.reply("Пожалуйста, выбери вариант из кнопок 👇");
      return;
    }

    const state = ctx.wizard.state as State;
    const telegramId = ctx.from!.id.toString();

    await sql`
      UPDATE users SET
        gender = ${state.gender!},
        age_group = ${state.age_group!},
        focus_area = ${state.focus_area!},
        life_phase = ${state.life_phase!},
        relationship_status = ${state.relationship_status!},
        zodiac_sign = ${ZODIAC_MAP[ctx.message.text]}
      WHERE telegram_id = ${telegramId}
    `;

    await ctx.reply(
      "✨ Готово! Профиль настроен.",
      Markup.removeKeyboard(),
    );
    await ctx.reply(
      "Что делаем?",
      Markup.inlineKeyboard([
        [Markup.button.callback("🃏 Карта дня", "daily")],
        [Markup.button.callback("✨ Полный расклад", "buy_full_reading")],
      ]),
    );

    return ctx.scene.leave();
  },
);
