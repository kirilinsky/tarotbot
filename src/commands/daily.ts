import { bot } from "../bot";
import { sql } from "../db";
import { getNarrativeForecast } from "../utils/get_forecast";
import { UserType } from "../types/user";
import { isSameDay } from "date-fns";

bot.command("daily", async (ctx) => {
  const telegramId = ctx.from.id.toString();

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
    return ctx.reply(
      "Ты уже получал(а) карту сегодня 🌞 Попробуй снова завтра!",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔮 Купить полный расклад",
                callback_data: "buy_full_reading",
              },
            ],
          ],
        },
      }
    );
  }

  const cardResult = getNarrativeForecast(user);
  await ctx.reply(cardResult.text, { parse_mode: "Markdown" });

  const timestamp = new Date().toISOString();
  const cards = [{ id: cardResult.cardId, position: cardResult.position }];
  const lastCardPull = {
    date: timestamp,
    type: "free",
    cards,
    summary: cardResult.summary,
  };

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
});

bot.on("callback_query", async (ctx) => {
  if ("data" in ctx.callbackQuery) {
    const data = ctx.callbackQuery.data;
    if (data === "buy_full_reading") {
      await ctx.answerCbQuery();
      await ctx.reply(
        "✨ Эта функция в разработке. Совсем скоро ты сможешь узнать всё!"
      );
    }
  }
});
