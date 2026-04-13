import { Context, Scenes } from "telegraf";

export interface OnboardingSession extends Scenes.WizardSessionData {
  gender?: string;
  age_group?: string;
  focus_area?: string;
  life_phase?: string;
  relationship_status?: string;
}

export interface BotContext extends Context {
  session: Scenes.WizardSession<OnboardingSession>;
  scene: Scenes.SceneContextScene<BotContext, OnboardingSession>;
  wizard: Scenes.WizardContextWizard<BotContext>;
}
