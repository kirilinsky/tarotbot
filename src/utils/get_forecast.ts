import rawCards from "../cards/data.json";
import { additional } from "../cards/additional";
import { CardPosition, CardSeason, CardType, ZodiacSign } from "../types/card";
import { getTimeOfDay } from "./get_daytime";
import { getRandomItem } from "./get_random_item";
import { getSeasonFromDate } from "./get_season";
import { UserType } from "../types/user";

const LIFE_PHASE_CONTEXT: Record<string, string> = {
  searching: "в момент поиска",
  crisis: "в трудный момент",
  stable: "когда всё, кажется, устоялось",
  transition: "на перекрёстке перемен",
  in_love: "когда сердце открыто",
  uncertain: "в тумане неопределённости",
};

const FOCUS_CLIFFHANGER: Record<string, string[]> = {
  love: [
    "Карта держит кое-что о твоей любовной истории — но это не умещается в одну строку.",
    "В полном раскладе есть ответ на вопрос, который ты ещё не задал(а) вслух.",
  ],
  career: [
    "Есть знак, связанный с твоим профессиональным путём — он виден только в развёрнутом чтении.",
    "Карта намекает на поворот в делах — но детали скрыты.",
  ],
  self: [
    "Что-то в твоём внутреннем мире сейчас меняется — полный расклад покажет что именно.",
    "Карта держит зеркало — но отражение целиком открывается только в развёрнутом чтении.",
  ],
  money: [
    "Есть финансовый сигнал — позитивный или предупреждающий. Что именно — в полном раскладе.",
    "Нюанс в твоей материальной ситуации, который стоит знать прямо сейчас.",
  ],
  family: [
    "В семейном поле что-то движется. Полная картина — в развёрнутом чтении.",
    "Есть послание для твоих близких отношений — оно ждёт в полном чтении.",
  ],
  health: [
    "Карта замечает сигнал тела или энергии. В полном раскладе он расшифрован.",
    "Есть подсказка о твоём состоянии, которую стоит услышать целиком.",
  ],
  other: [
    "Карта видит больше, чем говорит в коротком прочтении.",
    "Полный расклад раскроет то, что сейчас лишь мерцает на краю.",
  ],
};

export function getNarrativeForecast(user: UserType) {
  const cards = rawCards as CardType[];
  const card = cards[Math.floor(Math.random() * cards.length)];

  const position: CardPosition = Math.random() > 0.5 ? "upright" : "reversed";
  const season: CardSeason = getSeasonFromDate();
  const timeOfDay = getTimeOfDay();
  const side = card[position];

  const trigger = getRandomItem(card.psychological_triggers ?? []);
  const zodiacHint = user.zodiac_sign
    ? card.zodiacHints?.[user.zodiac_sign as ZodiacSign]
    : null;

  const cardAdditional = additional[card.id as keyof typeof additional];

  const teaser = cardAdditional
    ? getRandomItem(cardAdditional.dailyHook.teaser[user.gender][user.age_group])
    : getRandomItem(card.metaphors ?? []);

  const lifePhaseHint = cardAdditional && user.life_phase
    ? getRandomItem(cardAdditional.lifePhaseHints[user.life_phase])
    : null;
  const lifePhaseCtx = LIFE_PHASE_CONTEXT[user.life_phase!] ?? "в этот момент";

  const focusHint = cardAdditional && user.focus_area
    ? getRandomItem(cardAdditional.focusHints[user.focus_area])
    : null;
  const cliffhanger = getRandomItem(
    FOCUS_CLIFFHANGER[user.focus_area ?? "other"],
  );

  const ageMeaning = card.ageSpecificMeanings?.[user.age_group] ?? null;
  const genderHint = getRandomItem(card.genderHints?.[user.gender] ?? []);

  const atmosphere =
    timeOfDay === "morning" || timeOfDay === "day"
      ? side.emotionalTone[timeOfDay]
      : card.seasonalHint[season];

   const meaningFirst = side.meaning.split(/\.\s+/)[0].replace(/\.$/, "");
  const meaningClean = meaningFirst
    .replace(/^Карта (символизирует|указывает на|говорит о)\s*/i, "")
    .replace(/^В перевёрнутом (положении|виде)\s+\S+\s+(указывает на|говорит о|может говорить о)\s*/i, "")
    .replace(/^Период\s+/i, "")
    .replace(/^Блок\s+/i, "блок ");

  const positionLabel =
    position === "upright" ? "прямое положение" : "перевёрнутое положение";

  const lifePhaseOpener = lifePhaseHint
    ? lifePhaseHint
    : `${lifePhaseCtx.charAt(0).toUpperCase() + lifePhaseCtx.slice(1)} — ${meaningClean.charAt(0).toLowerCase() + meaningClean.slice(1)}`;

  const mainPara = zodiacHint
    ? `${lifePhaseOpener}. ${zodiacHint}.`
    : `${lifePhaseOpener}.`;

  const extraLine = [ageMeaning, genderHint].filter(Boolean).join(" ");

  const story = `
🃏 *${card.name}* — ${positionLabel}

_${teaser}_

${mainPara}
${extraLine ? `\n${extraLine}\n` : ""}
*${atmosphere}*

— — —
_${trigger}_ — именно это стоит за этой картой сейчас.
${focusHint ? `\n${focusHint}\n` : ""}
${cliffhanger}
🔮 *Хочешь знать больше?* Полный расклад — для тех, кто готов увидеть картину целиком.
`.trim();

  const summary = `${card.name} (${positionLabel}): ${side.meaning}`;

  return {
    cardId: card.id,
    name: card.name,
    position,
    season,
    text: story,
    summary,
  };
}
