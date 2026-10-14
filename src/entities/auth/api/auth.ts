import { createBrowserClient } from "@/shared/api";
import { syncProfileFromAuthUser } from "./profile";

export async function getCurrentUser() {
  const supabase = createBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  return syncProfileFromAuthUser(user);
}
