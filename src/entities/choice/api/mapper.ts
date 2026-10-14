import type { Choice, FeedSort } from "../model/types";

export type GameRow = {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  option_a_text: string;
  option_b_text: string;
  option_a_image_url: string | null;
  option_b_image_url: string | null;
  created_at: string;
};

export type GameListRow = GameRow & {
  author: { nickname: string | null } | null;
  votes: Array<{ choice: string }> | null;
};

export const gameDetailSelect = `
  id,
  author_id,
  title,
  description,
  option_a_text,
  option_b_text,
  option_a_image_url,
  option_b_image_url,
  created_at,
  author:profiles!games_author_id_fkey(nickname),
  votes(choice)
`;

export function mapGameToChoice(row: GameListRow): Choice {
  const votes = row.votes ?? [];
  const voteACount = votes.filter((vote) => vote.choice === "A").length;
  const voteBCount = votes.filter((vote) => vote.choice === "B").length;

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    optionA: {
      id: `${row.id}-a`,
      label: row.option_a_text,
      imageUrl: row.option_a_image_url,
      voteCount: voteACount,
    },
    optionB: {
      id: `${row.id}-b`,
      label: row.option_b_text,
      imageUrl: row.option_b_image_url,
      voteCount: voteBCount,
    },
    authorId: row.author_id,
    authorName: row.author?.nickname?.trim() || "익명",
    createdAt: row.created_at,
  };
}

export function sortChoices(choices: Choice[], sort: FeedSort) {
  if (sort === "latest") {
    return [...choices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return [...choices].sort((a, b) => {
    const totalA = a.optionA.voteCount + a.optionB.voteCount;
    const totalB = b.optionA.voteCount + b.optionB.voteCount;
    if (totalB !== totalA) return totalB - totalA;
    return b.createdAt.localeCompare(a.createdAt);
  });
}
