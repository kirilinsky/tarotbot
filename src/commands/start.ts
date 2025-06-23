import { bot } from "../bot";
import { getOrCreateUser } from "../utils/users";

bot.start(async (ctx) => {
  await getOrCreateUser(ctx.from);
  ctx.session = {};
  ctx.session.onboardingStep = "gender";

  await ctx.reply(
    `Добро пожаловать! Чтобы я лучше понимал тебя, ответь на пару вопросов 💫\n\nВыбери свой пол:`,
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
});
