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

const RELATIONSHIP_STATUSES = ["Сингл", "В отношениях"];

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
};

function keyboard(buttons: string[], columns = 2) {
  const rows: { text: string }[][] = [];
  for (let i = 0; i < buttons.length; i += columns) {
    rows.push(buttons.slice(i, i + columns).map((text) => ({ text })));
  }
  return Markup.keyboard(rows).resize().oneTime();
}

// Step 1 — gender
const stepGender = new Scenes.BaseScene<BotContext>("onboarding_gender");
stepGender.enter(async (ctx) => {
  await ctx.reply("Привет! Давай настроим твой профиль 💫\n\nВыбери свой пол:", keyboard(GENDERS));
});
stepGender.hears(GENDERS, async (ctx) => {
  ctx.scene.session.gender = GENDER_MAP[ctx.message.text];
  await ctx.scene.enter("onboarding_age");
});

// Step 2 — age group
const stepAge = new Scenes.BaseScene<BotContext>("onboarding_age");
stepAge.enter(async (ctx) => {
  await ctx.reply("🎂 Выбери свою возрастную группу:", keyboard(AGE_GROUPS));
});
stepAge.hears(AGE_GROUPS, async (ctx) => {
  ctx.scene.session.age_group = AGE_MAP[ctx.message.text];
  await ctx.scene.enter("onboarding_focus");
});

// Step 3 — focus area
const stepFocus = new Scenes.BaseScene<BotContext>("onboarding_focus");
stepFocus.enter(async (ctx) => {
  await ctx.reply("🎯 Что для тебя сейчас важнее всего?", keyboard(FOCUS_AREAS));
});
stepFocus.hears(FOCUS_AREAS, async (ctx) => {
  ctx.scene.session.focus_area = FOCUS_MAP[ctx.message.text];
  await ctx.scene.enter("onboarding_life_phase");
});

// Step 4 — life phase
const stepLifePhase = new Scenes.BaseScene<BotContext>("onboarding_life_phase");
stepLifePhase.enter(async (ctx) => {
  await ctx.reply("🌱 В каком ты сейчас жизненном этапе?", keyboard(LIFE_PHASES));
});
stepLifePhase.hears(LIFE_PHASES, async (ctx) => {
  ctx.scene.session.life_phase = LIFE_PHASE_MAP[ctx.message.text];
  await ctx.scene.enter("onboarding_relationship");
});

// Step 5 — relationship status
const stepRelationship = new Scenes.BaseScene<BotContext>("onboarding_relationship");
stepRelationship.enter(async (ctx) => {
  await ctx.reply("💞 Ты сейчас сингл или в отношениях?", keyboard(RELATIONSHIP_STATUSES));
});
stepRelationship.hears(RELATIONSHIP_STATUSES, async (ctx) => {
  ctx.scene.session.relationship_status = RELATIONSHIP_MAP[ctx.message.text];
  await ctx.scene.enter("onboarding_zodiac");
});

// Step 6 — zodiac sign
const stepZodiac = new Scenes.BaseScene<BotContext>("onboarding_zodiac");
stepZodiac.enter(async (ctx) => {
  await ctx.reply("♈ Твой знак зодиака?", keyboard(ZODIAC_SIGNS, 3));
});
stepZodiac.hears(ZODIAC_SIGNS, async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const s = ctx.scene.session;

  await sql`
    UPDATE users SET
      gender = ${s.gender!},
      age_group = ${s.age_group!},
      focus_area = ${s.focus_area!},
      life_phase = ${s.life_phase!},
      relationship_status = ${s.relationship_status!},
      zodiac_sign = ${ctx.message.text}
    WHERE telegram_id = ${telegramId}
  `;

  await ctx.reply(
    "✨ Готово! Профиль настроен.\n\nНапиши /daily, чтобы получить карту дня 🃏",
    Markup.removeKeyboard()
  );

  await ctx.scene.leave();
});

export const onboardingScenes = [
  stepGender,
  stepAge,
  stepFocus,
  stepLifePhase,
  stepRelationship,
  stepZodiac,
];
