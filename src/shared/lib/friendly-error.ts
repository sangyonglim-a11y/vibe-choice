const FRIENDLY_MESSAGES = new Set([
  "댓글 내용을 입력해 주세요.",
  "닉네임을 입력해 주세요.",
  "이미 사용 중인 닉네임입니다.",
  "닉네임은 2자 이상이어야 합니다.",
  "닉네임은 20자 이하여야 합니다.",
  "로그인이 필요합니다.",
  "필수 항목을 확인해 주세요.",
  "투표를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.",
]);

type ErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

function asErrorLike(error: unknown): ErrorLike | null {
  if (!error || typeof error !== "object") return null;
  return error as ErrorLike;
}

export function toFriendlyErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (typeof error === "string" && FRIENDLY_MESSAGES.has(error)) {
    return error;
  }

  if (error instanceof Error && FRIENDLY_MESSAGES.has(error.message)) {
    return error.message;
  }

  const details = asErrorLike(error);
  const code = details?.code;
  const message = details?.message?.toLowerCase() ?? "";

  if (code === "23505" || message.includes("duplicate")) {
    return "이미 처리된 요청이에요. 화면을 새로고침한 뒤 다시 확인해 주세요.";
  }

  if (
    code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission") ||
    message.includes("not authorized")
  ) {
    return "이 작업을 할 권한이 없어요. 로그인 상태를 확인해 주세요.";
  }

  if (
    code === "PGRST116" ||
    message.includes("0 rows") ||
    message.includes("not found")
  ) {
    return "요청한 내용을 찾을 수 없어요. 잠시 후 다시 시도해 주세요.";
  }

  if (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("timeout")
  ) {
    return "네트워크 연결이 불안정해요. 연결을 확인한 뒤 다시 시도해 주세요.";
  }

  if (
    message.includes("jwt") ||
    message.includes("session") ||
    message.includes("auth")
  ) {
    return "로그인이 만료되었을 수 있어요. 다시 로그인해 주세요.";
  }

  return fallback;
}
