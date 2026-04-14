import { bot } from "../bot";
import { sql } from "../db";
import { getNarrativeForecast } from "../utils/get_forecast";
import { UserType } from "../types/user";
import { isSameDay } from "date-fns";
import { Context } from "telegraf";
import { message } from "telegraf/filters";
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
          [{ text: "🎲 Второй шанс", callback_data: "redraw" }],
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
        [{ text: "🎲 Второй шанс", callback_data: "redraw" }],
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

bot.action("redraw", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithInvoice({
    title: "Второй шанс",
    description:
      "Перерасклад — новая карта дня. Иногда судьба хочет сказать что-то другое.",
    payload: "redraw",
    provider_token: "",
    currency: "XTR",
    prices: [{ label: "Второй шанс", amount: 1 }],
  });
});

bot.on("pre_checkout_query", async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on(message("successful_payment"), async (ctx) => {
  const payment = ctx.message.successful_payment;
  if (payment.invoice_payload !== "redraw") return;

  const telegramId = ctx.from.id.toString();
  const [user] = await withRetry(
    () =>
      sql<UserType[]>`SELECT * FROM users WHERE telegram_id = ${telegramId}`,
  );

  if (!user) return;

  const cardResult = getNarrativeForecast(user);
  const redrawnText = [
    cardResult.text,
    "",
    "_Карты иногда сами просят пересмотра — это не слабость, а чуткость к знакам._",
  ].join("\n");

  await ctx.reply(redrawnText, {
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
    type: "paid" as const,
    cards,
    summary: cardResult.summary,
  };

  await withRetry(
    () => sql`
    INSERT INTO readings (user_id, timestamp, type, theme, cards, summary, paid)
    VALUES (${telegramId}, ${timestamp}, 'paid', 'redraw', ${sql.json(cards)}, ${cardResult.summary}, true)
  `,
  );

  await withRetry(
    () => sql`
    UPDATE users SET
      last_card_pull = ${sql.json(lastCardPull)},
      total_paid_readings = ${(user.total_paid_readings || 0) + 1},
      total_stars_spent = ${(user.total_stars_spent || 0) + 1},
      total_purchases = ${(user.total_purchases || 0) + 1},
      last_purchase_at = ${timestamp}
    WHERE telegram_id = ${telegramId}
  `,
  );
});
