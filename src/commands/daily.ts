import { bot } from "../bot";
import { sql } from "../db";
import { getNarrativeForecast } from "../utils/get_forecast";
import { UserType } from "../types/user";
import { isSameDay } from "date-fns";
import { Context } from "telegraf";

export async function sendDailyReading(ctx: Context, telegramId: string) {
  const [user] = await sql<UserType[]>`SELECT * FROM users WHERE telegram_id = ${telegramId}`;

  if (!user) {
    return ctx.reply("Произошла ошибка при получении профиля.");
  }

  if (!user.gender || !user.age_group) {
    return ctx.reply("Сначала нужно пройти /start и настроить профиль 🧙");
  }

  const lastDate = user.last_card_pull?.date;
  const alreadyToday = lastDate && isSameDay(new Date(lastDate), new Date());

  if (alreadyToday) {
    const got = user.gender === "female" ? "получала" : "получал";
    return ctx.reply(
      `Ты уже ${got} карту сегодня 🌞 Попробуй снова завтра!`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: "🔮 Полный расклад", callback_data: "buy_full_reading" },
          ]],
        },
      }
    );
  }

  const cardResult = getNarrativeForecast(user);
  await ctx.reply(cardResult.text, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "🔮 Полный расклад", callback_data: "buy_full_reading" },
      ]],
    },
  });

  const timestamp = new Date().toISOString();
  const cards = [{ id: cardResult.cardId, position: cardResult.position }];
  const lastCardPull = { date: timestamp, type: "free", cards, summary: cardResult.summary };

  await sql`
    INSERT INTO readings (user_id, timestamp, type, theme, cards, summary, paid)
    VALUES (${telegramId}, ${timestamp}, 'free', 'daily', ${sql.json(cards)}, ${cardResult.summary}, false)
  `;

  await sql`
    UPDATE users SET
      last_card_pull = ${sql.json(lastCardPull)},
      total_free_readings = ${(user.total_free_readings || 0) + 1}
    WHERE telegram_id = ${telegramId}
  `;
}

bot.command("daily", async (ctx) => {
  await sendDailyReading(ctx, ctx.from.id.toString());
});

bot.action("buy_full_reading", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("✨ Эта функция в разработке. Совсем скоро ты сможешь узнать всё!");
});
