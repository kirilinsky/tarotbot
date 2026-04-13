import postgres from "postgres";
import { cleanEnv } from "./utils/cleanEnv";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const sql = postgres(cleanEnv(process.env.DATABASE_PUBLIC_URL!), {
  ssl: "require",
});
