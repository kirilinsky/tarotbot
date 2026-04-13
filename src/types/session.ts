import { Context, Scenes } from "telegraf";

export interface OnboardingSession extends Scenes.SceneSessionData {
  gender?: string;
  age_group?: string;
  focus_area?: string;
  life_phase?: string;
  relationship_status?: string;
}

export interface BotContext extends Context {
  session: Scenes.SceneSession<OnboardingSession>;
  scene: Scenes.SceneContextScene<BotContext, OnboardingSession>;
}
