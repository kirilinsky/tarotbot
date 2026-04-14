import { bot } from "../bot";
import { sql } from "../db";
import { getNarrativeForecast } from "../utils/get_forecast";
import { UserType } from "../types/user";
import { isSameDay } from "date-fns";
import { Context } from "telegraf";
import { withRetry } from "../utils/db-retry";

export async function sendDailyReading(ctx: Context, telegramId: string) {
  const [user] = await withRetry(
    () =>
      sql<UserType[]>`SELECT * FROM users WHERE telegram_id = ${telegramId}`,
  );

  if (!user) {
    return ctx.reply("Произошла ошибка при получении профиля.");
  }

  if (!user.gender || !user.age_group) {
    return ctx.reply("Сначала нужно пройти /start и настроить профиль 🧙");
  }

  const DEBUG_USERS = new Set(["339784494"]);
  const lastDate = user.last_card_pull?.date;
  const alreadyToday =
    !DEBUG_USERS.has(telegramId) &&
    lastDate &&
    isSameDay(new Date(lastDate), new Date());

  if (alreadyToday) {
    const got = user.gender === "female" ? "получала" : "получал";
    return ctx.reply(`Ты уже ${got} карту сегодня 🌞 Попробуй снова завтра!`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔮 Полный расклад", callback_data: "buy_full_reading" }],
        ],
      },
    });
  }

  const cardResult = getNarrativeForecast(user);
  await ctx.reply(cardResult.text, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔮 Полный расклад", callback_data: "buy_full_reading" }],
      ],
    },
  });

  const timestamp = new Date().toISOString();
  const cards = [{ id: cardResult.cardId, position: cardResult.position }];
  const lastCardPull = {
    date: timestamp,
    type: "free",
    cards,
    summary: cardResult.summary,
  };

  await withRetry(
    () => sql`
    INSERT INTO readings (user_id, timestamp, type, theme, cards, summary, paid)
    VALUES (${telegramId}, ${timestamp}, 'free', 'daily', ${sql.json(cards)}, ${cardResult.summary}, false)
  `,
  );

  await withRetry(
    () => sql`
    UPDATE users SET
      last_card_pull = ${sql.json(lastCardPull)},
      total_free_readings = ${(user.total_free_readings || 0) + 1}
    WHERE telegram_id = ${telegramId}
  `,
  );
}

bot.command("daily", async (ctx) => {
  await sendDailyReading(ctx, ctx.from.id.toString());
});

bot.action("buy_full_reading", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "🔮 *Полный расклад*\n\nТри карты — прошлое, настоящее и то, что ждёт впереди.\nРазвёрнутый AI-прогноз, персонально под тебя.",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✨ Купить расклад", callback_data: "purchase_reading" }],
          [{ text: "💎 Подписка", callback_data: "subscribe_from_reading" }],
          [{ text: "‹ Назад", callback_data: "back_to_main" }],
        ],
      },
    },
  );
});

bot.action("purchase_reading", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("⏳ Оплата через Telegram Stars — скоро!");
});
