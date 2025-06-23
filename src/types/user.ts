export type UserType = {
  telegramId: string;
  username?: string;
  firstName?: string;
  language: string;

  ageGroup: "under_18" | "18_25" | "26_35" | "36_45" | "46_60" | "60_plus";
  gender: "male" | "female" | "other";
  createdAt: string;
  lastSeen: string;

  lastCardPull?: {
    date: string;
    type: "free" | "paid";
    cards: { id: string; position: "upright" | "reversed" }[];
    summary: string;
  };

  lastPurchaseAt?: string;
  totalFreeReadings: number;
  totalPaidReadings: number;
};
