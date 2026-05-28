import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

export function createAdminClient() {
  const env = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!env || !serviceRoleKey || !serviceRoleKey.startsWith("eyJ")) {
    throw new Error(
      "Missing Supabase admin credentials. Use the service_role JWT (starts with eyJ) from Supabase → Settings → API, not sb_secret_* keys."
    );
  }
  return createClient(
    env.url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
