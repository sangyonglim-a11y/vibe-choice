export function validateNickname(nickname: string) {
  const trimmed = nickname.trim();

  if (!trimmed) {
    return "닉네임을 입력해 주세요.";
  }

  if (trimmed.length < 2) {
    return "닉네임은 2자 이상이어야 합니다.";
  }

  if (trimmed.length > 20) {
    return "닉네임은 20자 이하여야 합니다.";
  }

  return null;
}
