import { supabase } from "../supabase";

export async function getOrCreateUser(telegramUser: {
  id: number;
  username?: string;
  first_name?: string;
  language_code?: string;
}) {
  const telegramId = telegramUser.id.toString();
  const now = new Date().toISOString();

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (fetchError) {
    console.error("Ошибка при получении пользователя:", fetchError);
  }

  if (existingUser) {
    const { error: updateError } = await supabase
      .from("users")
      .update({ last_seen: now })
      .eq("telegram_id", telegramId);

    if (updateError) {
      console.error(
        "Ошибка при обновлении времени последнего визита:",
        updateError
      );
    }

    return { user: existingUser, isNew: false };
  }

  const newUser = {
    telegram_id: telegramId,
    username: telegramUser.username ?? null,
    first_name: telegramUser.first_name ?? null,
    language: telegramUser.language_code ?? "en",
    created_at: now,
    last_seen: now,
    total_free_readings: 0,
    total_paid_readings: 0,
  };

  return { user: newUser, isNew: true };
}
