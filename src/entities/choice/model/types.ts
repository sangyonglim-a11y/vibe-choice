export type VoteOption = "A" | "B";

export type ChoiceOption = {
  id: string;
  label: string;
  imageUrl: string | null;
  voteCount: number;
};

export type Choice = {
  id: string;
  title: string;
  description?: string;
  optionA: ChoiceOption;
  optionB: ChoiceOption;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export type FeedSort = "latest" | "popular";

export function isFeedSort(value: string | null | undefined): value is FeedSort {
  return value === "latest" || value === "popular";
}
