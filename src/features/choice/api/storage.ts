import { createBrowserClient } from "@/shared/api";

export const GAME_IMAGES_BUCKET = "game-images";

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

export async function uploadGameImage(
  userId: string,
  file: File,
  side: "A" | "B",
) {
  const supabase = createBrowserClient();
  const extension = getFileExtension(file);
  const path = `${userId}/${crypto.randomUUID()}-option-${side.toLowerCase()}.${extension}`;

  const { error } = await supabase.storage
    .from(GAME_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${extension}`,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(GAME_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
