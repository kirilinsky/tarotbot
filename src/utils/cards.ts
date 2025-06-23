import { UserType } from "../types/user";
import cards from "../cards/data.json";

type Position = "upright" | "reversed";

export function getRandomCardForUser(user: UserType) {
  const card = cards[Math.floor(Math.random() * cards.length)];
  const position: Position = Math.random() > 0.5 ? "upright" : "reversed";

  const side = card[position];

  const resultText = `
🃏 Карта дня: *${card.name}* (${
    position === "upright" ? "Прямое" : "Перевёрнутое"
  } положение)

*Значение:* ${side.meaning}

*Совет:* ${side.advice}

❤️ Любовь: ${side.love}
💼 Карьера: ${side.career}
⚠️ Предупреждение: ${side.warning}

🧠 Настроение: ${side.emotionalTone}
🪞 Афирмация: _${side.affirmations[0]}_

🎯 Возраст: ${card.ageSpecificMeanings[user.ageGroup]}
🌈 Для тебя: ${card.genderHints[user.gender]}
`.trim();

  return {
    cardId: card.id,
    name: card.name,
    position,
    text: resultText,
  };
}
