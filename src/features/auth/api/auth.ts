import { createBrowserClient } from "@/shared/api";
import { useAuthStore } from "../model/auth-store";

export async function signInWithGoogle(nextPath = "/") {
  const supabase = createBrowserClient();
  const redirectTo = new URL("/auth/callback", window.location.origin);
  redirectTo.searchParams.set("next", nextPath);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo.toString(),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();

  useAuthStore.getState().clear();

  if (error) {
    throw error;
  }
}

/** @deprecated Use signInWithGoogle instead */
export async function signIn() {
  return signInWithGoogle();
}

/** @deprecated Google OAuth does not use separate signup */
export async function signUp() {
  return signInWithGoogle();
}
