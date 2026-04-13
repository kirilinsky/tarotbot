import { sql } from "../db";

export async function getOrCreateUser(telegramUser: {
  id: number;
  username?: string;
  first_name?: string;
  language_code?: string;
}) {
  const telegramId = telegramUser.id.toString();
  const now = new Date().toISOString();

  const [existingUser] = await sql`
    SELECT * FROM users WHERE telegram_id = ${telegramId}
  `;

  if (existingUser) {
    await sql`
      UPDATE users SET last_seen = ${now} WHERE telegram_id = ${telegramId}
    `;
    return { user: existingUser, isNew: false };
  }

  const [insertedUser] = await sql`
    INSERT INTO users (telegram_id, username, first_name, language, created_at, last_seen, total_free_readings, total_paid_readings)
    VALUES (${telegramId}, ${telegramUser.username ?? null}, ${telegramUser.first_name ?? null}, ${telegramUser.language_code ?? "en"}, ${now}, ${now}, 0, 0)
    RETURNING *
  `;

  return { user: insertedUser, isNew: true };
}
