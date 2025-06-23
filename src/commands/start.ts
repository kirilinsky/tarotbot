import { bot } from "../bot";
import { getOrCreateUser } from "../utils/users";

bot.start(async (ctx) => {
  const { user, isNew } = await getOrCreateUser(ctx.from);

  if (isNew || !user.gender || !user.age_group) {
    await ctx.reply(
      `Привет! Давай настроим твой профиль 💫\n\nВыбери свой пол:`,
      {
        reply_markup: {
          keyboard: [
            [{ text: "Мужской" }, { text: "Женский" }],
            [{ text: "Другой" }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } else {
    await ctx.reply(
      `Привет, ${user.first_name || "друг"}! 🔮 Готов к новому раскладу? `
    );
  }
});
