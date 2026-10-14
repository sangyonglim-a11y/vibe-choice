import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/shared/api/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next") || "/";
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .maybeSingle();

        const hasNickname = Boolean(profile?.nickname?.trim());
        if (!hasNickname) {
          return NextResponse.redirect(new URL("/auth/nickname", origin));
        }
      }

      return NextResponse.redirect(new URL(nextPath, origin));
    }

    console.error("[auth/callback] exchangeCodeForSession failed", error);
  }

  return NextResponse.redirect(
    new URL("/auth/login?error=oauth_callback", origin),
  );
}
