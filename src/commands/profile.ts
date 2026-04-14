import { bot } from "../bot";
import { Markup } from "telegraf";

const MAIN_KEYBOARD = Markup.inlineKeyboard([
  [Markup.button.callback("🃏 Карта дня", "daily")],
  [Markup.button.callback("✨ Полный расклад", "buy_full_reading")],
  [Markup.button.callback("⚙️ Настройки", "settings")],
]);

const SETTINGS_KEYBOARD = Markup.inlineKeyboard([
  [Markup.button.callback("✏️ Редактировать профиль", "edit_profile")],
  [Markup.button.callback("ℹ️ О боте", "about")],
  [Markup.button.callback("💎 Подписка", "subscribe")],
  [Markup.button.callback("‹ Назад", "back_to_main")],
]);

const EDIT_KEYBOARD = Markup.inlineKeyboard([
  [
    Markup.button.callback("♀♂ Пол", "edit_field_gender"),
    Markup.button.callback("🎂 Возраст", "edit_field_age_group"),
  ],
  [
    Markup.button.callback("🎯 Фокус", "edit_field_focus_area"),
    Markup.button.callback("🌱 Этап жизни", "edit_field_life_phase"),
  ],
  [
    Markup.button.callback(
      "💞 Статус отношений",
      "edit_field_relationship_status",
    ),
  ],
  [Markup.button.callback("♈ Знак зодиака", "edit_field_zodiac_sign")],
  [Markup.button.callback("‹ Назад", "settings")],
]);

bot.action("back_to_main", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("Что делаем?", {
    reply_markup: MAIN_KEYBOARD.reply_markup,
  });
});

bot.action("settings", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("⚙️ *Настройки*", {
    parse_mode: "Markdown",
    reply_markup: SETTINGS_KEYBOARD.reply_markup,
  });
});

bot.action("edit_profile", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "✏️ *Редактирование профиля*\n\nЧто хочешь изменить?",
    {
      parse_mode: "Markdown",
      reply_markup: EDIT_KEYBOARD.reply_markup,
    },
  );
});

const EDIT_FIELDS = [
  "gender",
  "age_group",
  "focus_area",
  "life_phase",
  "relationship_status",
  "zodiac_sign",
];

for (const field of EDIT_FIELDS) {
  bot.action(`edit_field_${field}`, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    await ctx.scene.enter("profile_edit", { field });
  });
}

const ABOUT_TEXT =
  `ℹ️ *TarotSoul Bot*\n\n` +
  `Бот для ежедневных персонализированных таро-прогнозов.\n\n` +
  `*Как это работает:*\n` +
  `Карта и её интерпретация формируются на основе твоего профиля — пола, возраста, знака зодиака и текущего жизненного этапа. Никакой мистики: это художественная интерпретация, не предсказание.\n\n` +
  `*Данные:*\n` +
  `Мы храним только то, что ты указал(а) при настройке профиля, и историю твоих раскладов. Данные не передаются третьим лицам.\n\n` +
  `*Ограничение ответственности:*\n` +
  `Бот носит исключительно развлекательный характер. Не является заменой профессиональной психологической, медицинской или финансовой консультации.\n\n` +
  bot.action("about", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(ABOUT_TEXT, {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback("‹ Назад", "settings")],
      ]).reply_markup,
    });
  });

bot.action("subscribe", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(`💎 *Подписка*\n\n` + `⏳ Скоро...`, {
    parse_mode: "Markdown",
    reply_markup: Markup.inlineKeyboard([
      [Markup.button.callback("‹ Назад", "settings")],
    ]).reply_markup,
  });
});
