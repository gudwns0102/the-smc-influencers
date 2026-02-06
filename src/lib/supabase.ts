import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabase_project_id = process.env["SUPABASE_PROJECT_ID"];
const secret_api_key = process.env["SUPABASE_SECRET_KEY"];

if (!supabase_project_id || !secret_api_key) {
  throw new Error("Missing Supabase credentials in environment variables");
}

export const supabase = createClient<Database>(
  `https://${supabase_project_id}.supabase.co`,
  secret_api_key,
);
