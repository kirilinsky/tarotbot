import postgres from "postgres";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const rawUrl = process.env.DATABASE_URL ?? "";
const dbUrl = rawUrl.includes("${{")
  ? process.env.DATABASE_PUBLIC_URL!
  : rawUrl;

export const sql = postgres(dbUrl, {
  ssl: "require",
});
