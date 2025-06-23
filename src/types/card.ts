export type CardPosition = "upright" | "reversed";
export type CardSeason = "spring" | "summer" | "autumn" | "winter";
export type Gender = "male" | "female";
export type AgeGroup =
  | "under_18"
  | "18_25"
  | "26_35"
  | "36_45"
  | "46_60"
  | "60_plus";
export type FocusArea =
  | "love"
  | "career"
  | "self"
  | "money"
  | "family"
  | "health"
  | "other";
export type LifePhase =
  | "searching"
  | "crisis"
  | "stable"
  | "transition"
  | "in_love";

export type CardEmotionalTone = {
  morning: string;
  day: string;
  evening: string;
  night: string;
};

export type CardSide = {
  keywords: string[];
  meaning: string;
  advice: string;
  emotionalTone: CardEmotionalTone;
  love: string;
  career: string;
  warning: string;
  affirmations: {
    male: string[];
    female: string[];
  };
};

export type CardType = {
  id: string;
  name: string;
  arcana: "major" | "minor";
  number: number;
  suit?: "cups" | "swords" | "wands" | "pentacles" | null;
  imageUrl: string;

  themes: string[];
  psychological_triggers: string[];
  metaphors: string[];

  upright: CardSide;
  reversed: CardSide;

  ageSpecificMeanings: Record<AgeGroup, string>;
  genderHints: Record<Gender, string[]>;
  seasonalHint: Record<CardSeason, string>;
};
