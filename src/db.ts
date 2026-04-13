import postgres from "postgres";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL!
    : process.env.DATABASE_PUBLIC_URL!;

export const sql = postgres(dbUrl, {
  ssl: "require",
});
