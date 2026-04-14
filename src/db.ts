import postgres from "postgres";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.DATABASE_PUBLIC_URL ?? process.env.DATABASE_URL!;

export const sql = postgres(dbUrl, {
  ssl: dbUrl.includes("railway.internal") ? false : "require",
  idle_timeout: 20,       
  max_lifetime: 60 * 10,  
  connect_timeout: 10,    
});
