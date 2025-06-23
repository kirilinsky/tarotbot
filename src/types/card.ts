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

  upright: {
    keywords: string[];
    meaning: string;
    advice: string;
    emotionalTone: string;
    love: string;
    career: string;
    warning: string;
    affirmations: string[];
  };

  reversed: {
    keywords: string[];
    meaning: string;
    advice: string;
    emotionalTone: string;
    love: string;
    career: string;
    warning: string;
    affirmations: string[];
  };

  ageSpecificMeanings: Record<
    "under_18" | "18_25" | "26_35" | "36_45" | "46_60" | "60_plus",
    string
  >;

  genderHints: {
    male: string;
    female: string;
    other: string;
  };

  dailyHook: {
    teaser: string;
    fullPromise: string;
  };
};
