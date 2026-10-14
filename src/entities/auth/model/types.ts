export type User = {
  id: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
};

export function hasNickname(user: User | null | undefined): boolean {
  return Boolean(user?.nickname?.trim());
}
