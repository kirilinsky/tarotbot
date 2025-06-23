import { AgeGroup, FocusArea, Gender, LifePhase } from "./card";

export type CardAdditionals = {
  [cardId: string]: CardAdditional;
};

export type CardAdditional = {
  focusHints: Record<FocusArea, string[]>;
  lifePhaseHints: Record<LifePhase, string[]>;
  dailyHook: {
    teaser: Record<Gender, Record<AgeGroup, string[]>>;
    fullPromise: Record<Gender, Record<AgeGroup, string[]>>;
  };
};
