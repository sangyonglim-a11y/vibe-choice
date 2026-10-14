import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/shared/config";
import type { Database } from "@/shared/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
  );
}
