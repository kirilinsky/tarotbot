import { sql } from "../db";

export async function getOrCreateUser(
  telegramUser: {
    id: number;
    username?: string;
    first_name?: string;
    language_code?: string;
  },
  referralSource?: string,
) {
  const telegramId = telegramUser.id.toString();
  const now = new Date().toISOString();

  const [existingUser] = await sql`
    SELECT * FROM users WHERE telegram_id = ${telegramId}
  `;

  if (existingUser) {
    const [updatedUser] = await sql`
      UPDATE users SET
        last_seen = ${now},
        sessions_count = sessions_count + 1
      WHERE telegram_id = ${telegramId}
      RETURNING *
    `;
    return { user: updatedUser, isNew: false };
  }

  const [insertedUser] = await sql`
    INSERT INTO users (
      telegram_id, username, first_name, language,
      created_at, last_seen,
      total_free_readings, total_paid_readings,
      total_stars_spent, total_purchases,
      subscription_status, sessions_count,
      referral_source
    )
    VALUES (
      ${telegramId}, ${telegramUser.username ?? null}, ${telegramUser.first_name ?? null}, ${telegramUser.language_code ?? "en"},
      ${now}, ${now},
      0, 0,
      0, 0,
      'none', 1,
      ${referralSource ?? null}
    )
    RETURNING *
  `;

  return { user: insertedUser, isNew: true };
}
