import rawCards from "../cards/data.json";
import { CardPosition, CardSeason, CardType } from "../types/card";
import { getTimeOfDay } from "./get_daytime";
import { getRandomItem } from "./get_random_item";
import { getSeasonFromDate } from "./get_season";
import { UserType } from "../types/user";
import { additional } from "../cards/additional";
import { CardAdditional, CardAdditionals } from "../types/additional";

export function getNarrativeForecast(user: UserType) {
  const cards = rawCards as CardType[];
  const card = cards[Math.floor(Math.random() * cards.length)];
  const cardExtras: CardAdditional = (additional as CardAdditionals)[card.id];

  const position: CardPosition = Math.random() > 0.5 ? "upright" : "reversed";
  const season: CardSeason = getSeasonFromDate();
  const timeOfDay = getTimeOfDay();
  const side = card[position];

  const ageMeaning = card.ageSpecificMeanings[user.age_group];
  const genderHint = getRandomItem(card.genderHints[user.gender] ?? []);
  const seasonLine = card.seasonalHint[season];

  const focusHint = getRandomItem(
    cardExtras?.focusHints?.[user.focus_area!] ?? []
  );
  const lifePhaseHint = getRandomItem(
    cardExtras?.lifePhaseHints?.[user.life_phase!] ?? []
  );
  const dailyTeaser = getRandomItem(
    cardExtras?.dailyHook?.teaser?.[user.gender]?.[user.age_group] ?? []
  );
  const dailyPromise = getRandomItem(
    cardExtras?.dailyHook?.fullPromise?.[user.gender]?.[user.age_group] ?? []
  );
  const emotionalTone = side.emotionalTone[timeOfDay];
  const affirmation = getRandomItem(side.affirmations?.[user.gender] ?? []);

  const story = `
🃏 *Сегодняшняя карта: ${card.name}*  
${
  position === "upright" ? "Прямое" : "Перевёрнутое"
} положение — это знак: _${side.meaning.toLowerCase()}_

🌿 *Контекст*: ${seasonLine}  
🔍 *Жизненный этап*: ${lifePhaseHint}  
🎯 *Текущий фокус*: ${focusHint}

💬 *Совет*: ${side.advice}  
❤️ *Отношения*: ${side.love}  
💼 *Работа*: ${side.career}  
⚠️ *Осторожно*: ${side.warning}

🌀 *Сейчас ты можешь ощущать*: _${emotionalTone}_  
🪞 *Аффирмация дня*: _${affirmation}_

${ageMeaning} ${genderHint}

🎁 *Подсказка дня*: ${dailyTeaser}  
✨ *Обещание карты*: ${dailyPromise}

— — —  
🔮 *Иногда одного взгляда недостаточно...*  
Хочешь узнать больше? Попробуй полноценный расклад — и ты увидишь, как всё связано.
`.trim();

  return {
    cardId: card.id,
    name: card.name,
    position,
    season,
    text: story,
  };
}
