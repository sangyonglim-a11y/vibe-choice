const GUEST_VOTER_KEY = "vibe-choice-guest-voter-key";

function createGuestKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `guest:${crypto.randomUUID()}`;
  }
  return `guest:${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getGuestVoterKey() {
  if (typeof window === "undefined") {
    return null;
  }

  const existing = window.localStorage.getItem(GUEST_VOTER_KEY);
  if (existing) {
    return existing;
  }

  const next = createGuestKey();
  window.localStorage.setItem(GUEST_VOTER_KEY, next);
  return next;
}

export function resolveVoterIdentity(userId: string | null | undefined) {
  if (userId) {
    return {
      userId,
      voterKey: userId,
    };
  }

  const guestKey = getGuestVoterKey();
  if (!guestKey) {
    throw new Error("투표를 준비하지 못했어요. 잠시 후 다시 시도해 주세요.");
  }

  return {
    userId: null,
    voterKey: guestKey,
  };
}
