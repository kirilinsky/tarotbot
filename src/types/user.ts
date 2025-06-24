export type RelationshipStatus = "single" | "in_relationship";

export type UserType = {
  telegramId: string;
  username?: string;
  firstName?: string;
  language: string;
  relationship_status?: RelationshipStatus;

  age_group: "under_18" | "18_25" | "26_35" | "36_45" | "46_60" | "60_plus";
  gender: "male" | "female";
  created_at: string;
  last_seen: string;

  last_card_pull?: {
    date: string;
    type: "free" | "paid";
    cards: { id: string; position: "upright" | "reversed" }[];
    summary: string;
  };
  focus_area?:
    | "love"
    | "career"
    | "self"
    | "money"
    | "family"
    | "health"
    | "other";

  life_phase?:
    | "searching"
    | "crisis"
    | "stable"
    | "transition"
    | "in_love"
    | "uncertain";
  last_purchase_at?: string;
  total_free_readings: number;
  total_paid_readings: number;
};
