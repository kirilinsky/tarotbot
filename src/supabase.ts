import { createClient } from "@supabase/supabase-js";
import { cleanEnv } from "./utils/cleanEnv";

export const supabase = createClient(
  cleanEnv(process.env.SUPABASE_PROJECT_URL!),
  cleanEnv(process.env.SUPABASE_ANON_PUBLIC_KEY!)
);
