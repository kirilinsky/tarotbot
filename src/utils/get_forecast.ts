import rawCards from "../cards/data.json";
import { additional } from "../cards/additional";
import { CardPosition, CardSeason, CardType, ZodiacSign } from "../types/card";
import { getTimeOfDay } from "./get_daytime";
import { getRandomItem } from "./get_random_item";
import { getSeasonFromDate } from "./get_season";
import { UserType } from "../types/user";

const POSITION_LABELS: Record<CardPosition, string[]> = {
  upright: [
    "прямое положение",
    "свет карты",
    "открытая энергия",
    "лицом к тебе",
  ],
  reversed: [
    "перевёрнутое положение",
    "тень карты",
    "скрытая сила",
    "обратная сторона",
  ],
};

const TRIGGER_CONNECTORS: string[] = [
  "именно это стоит за этой картой сейчас.",
  "карта видит это в тебе прямо сейчас.",
  "вот что карта несёт тебе сегодня.",
  "это то, что карта замечает в тебе в этот момент.",
  "это энергия, которую карта чувствует в тебе.",
  "с этим ты входишь в сегодняшний день.",
  "именно здесь карта встречает тебя сегодня.",
  "это то, что уже живёт внутри тебя — карта просто называет это вслух.",
  "карта не угадывает — она отражает.",
  "вот откуда эта карта говорит с тобой.",
  "это не случайно попало в твой расклад сегодня.",
  "карта видит в тебе именно это — и именно сейчас.",
  "это резонирует с тем, что происходит в тебе прямо сейчас.",
];

const UPSELL_CTAS: string[] = [
  "🔮 *Хочешь знать больше?* Полный расклад — для тех, кто готов увидеть картину целиком.",
  "🔮 *Это ещё не всё.* Три карты, твоё прошлое, настоящее и то, что ждёт впереди.",
  "🔮 *Карта видит больше, чем умещается здесь.* Полный расклад раскроет то, что ты чувствуешь, но не можешь объяснить.",
  "🔮 *Ты чувствуешь, что это не случайно?* Полный расклад ответит на вопрос, который ты несёшь в себе.",
];

const WARNING_FRAMES: string[] = [
  "⚠️ {warning} Как именно это проявится у тебя — станет ясно в полном раскладе.",
  "⚠️ {warning} Полное чтение покажет, как обойти это или использовать в свою пользу.",
  "⚠️ Карта предупреждает: {warning_lower} Детали — в развёрнутом раскладе.",
  "⚠️ {warning} Есть способ с этим работать — он виден в полном чтении.",
];

const FOCUS_CLIFFHANGER: Record<string, string[]> = {
  love: [
    "Карта держит кое-что о твоей любовной истории — это не умещается в одну строку.",
    "В полном раскладе есть ответ на вопрос, который ты ещё не задал(а) вслух.",
    "Есть деталь о твоих чувствах, которую карта показывает только в полном чтении.",
    "Что-то важное о твоих отношениях ждёт в развёрнутом раскладе — и это стоит знать.",
  ],
  career: [
    "Есть знак, связанный с твоим профессиональным путём — он виден только в развёрнутом чтении.",
    "Карта намекает на поворот в делах — но детали скрыты.",
    "Твой следующий шаг в карьере — карта его видит, но только в полном раскладе.",
    "Есть возможность (или риск) в профессиональной жизни — она раскроется в полном чтении.",
  ],
  self: [
    "Что-то в твоём внутреннем мире сейчас меняется — полный расклад покажет что именно.",
    "Карта держит зеркало — но отражение целиком открывается только в развёрнутом чтении.",
    "Внутри тебя идёт процесс, который карта видит полностью — но не в коротком прочтении.",
    "Твоя внутренняя правда сейчас ближе, чем кажется. Полный расклад её покажет.",
  ],
  money: [
    "Есть финансовый сигнал — позитивный или предупреждающий. Что именно — в полном раскладе.",
    "Нюанс в твоей материальной ситуации, который стоит знать прямо сейчас.",
    "Карта видит движение в твоих финансах — направление становится ясным в полном чтении.",
    "Знак о деньгах и ресурсах требует контекста — он есть в развёрнутом раскладе.",
  ],
  family: [
    "В семейном поле что-то движется. Полная картина — в развёрнутом чтении.",
    "Есть послание для твоих близких отношений — оно ждёт в полном чтении.",
    "Карта замечает динамику в твоём близком окружении — подробнее в полном раскладе.",
    "Что-то между тобой и близкими людьми сейчас в движении. Карта видит это целиком.",
  ],
  health: [
    "Карта замечает сигнал тела или энергии. В полном раскладе он расшифрован.",
    "Есть подсказка о твоём состоянии, которую стоит услышать целиком.",
    "Твоё тело или энергия сейчас что-то говорят. Полное прочтение расшифрует этот язык.",
    "Карта видит твоё состояние глубже, чем умещается в короткий прогноз.",
  ],
  other: [
    "Карта видит больше, чем говорит в коротком прочтении.",
    "Полный расклад раскроет то, что сейчас лишь мерцает на краю.",
    "Есть слой этой карты, который открывается только в развёрнутом чтении.",
    "То, что ты ищешь — карта видит. Для этого нужен полный расклад.",
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
  const ageMeaning = card.ageSpecificMeanings?.[user.age_group] ?? null;
  const genderHint = getRandomItem(card.genderHints?.[user.gender] ?? []);
  const affirmation = getRandomItem(side.affirmations?.[user.gender] ?? []);
  const loveLine = user.relationship_status
    ? (side.love?.[user.relationship_status] ?? null)
    : null;

  const cardAdditional = additional[card.id as keyof typeof additional];

  const teaser = cardAdditional
    ? getRandomItem(
        cardAdditional.dailyHook.teaser[user.gender][user.age_group],
      )
    : getRandomItem(card.metaphors ?? []);

  const lifePhaseHint =
    cardAdditional && user.life_phase
      ? getRandomItem(cardAdditional.lifePhaseHints[user.life_phase])
      : null;

  const focusHint =
    cardAdditional && user.focus_area
      ? getRandomItem(cardAdditional.focusHints[user.focus_area])
      : null;

  const atmosphere =
    timeOfDay === "morning" || timeOfDay === "day"
      ? side.emotionalTone[timeOfDay]
      : card.seasonalHint[season];

  const positionLabel = getRandomItem(POSITION_LABELS[position]);
  const triggerConnector = getRandomItem(TRIGGER_CONNECTORS);
  const upsellCta = getRandomItem(UPSELL_CTAS);
  const cliffhanger = getRandomItem(
    FOCUS_CLIFFHANGER[user.focus_area ?? "other"],
  );

  const warningText = side.warning ?? null;
  const warningBlock = warningText
    ? getRandomItem(WARNING_FRAMES)
        .replace("{warning}", warningText)
        .replace(
          "{warning_lower}",
          warningText.charAt(0).toLowerCase() + warningText.slice(1),
        )
    : null;

  const name = user.first_name;
  const namePrefix = name
    ? getRandomItem([`${name}, `, `${name} — `, `Для тебя, ${name}: `, ``])
    : "";

  const lifePhaseRaw = lifePhaseHint ?? "";
  const lifePhaseWithName =
    lifePhaseRaw && namePrefix
      ? namePrefix +
        lifePhaseRaw.charAt(0).toLowerCase() +
        lifePhaseRaw.slice(1)
      : lifePhaseRaw || namePrefix.replace(/[,\s—:]+$/, ".");

  const mainPara = [lifePhaseWithName, zodiacHint ?? ""]
    .filter(Boolean)
    .join(" ");

  const middleLines = [ageMeaning, genderHint, loveLine]
    .filter(Boolean)
    .join("\n\n");

  const story = `
🃏 *${card.name}* — ${positionLabel}

_${teaser}_

${mainPara}
${middleLines ? `\n${middleLines}\n` : ""}
*${atmosphere}*

— — —
_${trigger}_ — ${triggerConnector}
${focusHint ? `\n${focusHint}\n` : ""}${warningBlock ? `\n${warningBlock}\n` : ""}
${cliffhanger}
${upsellCta}
${affirmation ? `\n_${affirmation}_` : ""}
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
