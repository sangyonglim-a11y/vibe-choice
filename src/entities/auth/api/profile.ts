import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { createBrowserClient } from "@/shared/api";
import type { User } from "../model/types";

function mapProfileToUser(
  profile: {
    id: string;
    nickname: string | null;
    avatar_url: string | null;
  },
  email: string,
): User {
  return {
    id: profile.id,
    email,
    nickname: profile.nickname,
    avatarUrl: profile.avatar_url,
  };
}

function resolveAvatarUrl(authUser: SupabaseAuthUser) {
  const metadata = authUser.user_metadata ?? {};
  if (typeof metadata.avatar_url === "string" && metadata.avatar_url) {
    return metadata.avatar_url;
  }
  if (typeof metadata.picture === "string" && metadata.picture) {
    return metadata.picture;
  }
  return null;
}

export async function getProfileById(userId: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nickname, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function syncProfileFromAuthUser(
  authUser: SupabaseAuthUser,
): Promise<User> {
  const supabase = createBrowserClient();
  const email = authUser.email ?? "";
  const avatarUrl = resolveAvatarUrl(authUser);

  const existing = await getProfileById(authUser.id);

  if (existing) {
    const shouldUpdateAvatar =
      Boolean(avatarUrl) && existing.avatar_url !== avatarUrl;

    if (shouldUpdateAvatar) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", authUser.id)
        .select("id, nickname, avatar_url")
        .single();

      if (error) {
        throw error;
      }

      return mapProfileToUser(data, email);
    }

    return mapProfileToUser(existing, email);
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: authUser.id,
      nickname: null,
      avatar_url: avatarUrl,
    })
    .select("id, nickname, avatar_url")
    .single();

  if (error) {
    // Trigger may have created the profile concurrently.
    if (error.code === "23505") {
      const raced = await getProfileById(authUser.id);
      if (raced) {
        return mapProfileToUser(raced, email);
      }
    }
    throw error;
  }

  return mapProfileToUser(data, email);
}

export async function updateNickname(userId: string, nickname: string) {
  const trimmed = nickname.trim();
  if (!trimmed) {
    throw new Error("닉네임을 입력해 주세요.");
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ nickname: trimmed })
    .eq("id", userId)
    .select("id, nickname, avatar_url")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("이미 사용 중인 닉네임입니다.");
    }
    throw error;
  }

  return data;
}
