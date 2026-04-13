import { bot } from "../bot";
import { getOrCreateUser } from "../utils/users";

bot.start(async (ctx) => {
  const { user, isNew } = await getOrCreateUser(ctx.from);

  if (isNew || !user.gender || !user.age_group || !user.zodiac_sign) {
    await ctx.scene.enter("onboarding_gender");
  } else {
    await ctx.reply(
      `Привет, ${user.first_name || "друг"}! 🔮 Готов к новому раскладу?`
    );
  }
});
