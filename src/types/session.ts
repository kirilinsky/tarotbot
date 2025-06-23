import { Context } from "telegraf";

export interface SessionData {
  onboardingStep?: "gender" | "age";
}

export interface BotContext extends Context {
  session: SessionData;
}
