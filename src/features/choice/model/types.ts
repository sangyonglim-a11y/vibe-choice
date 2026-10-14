export type CreateChoiceFormValues = {
  title: string;
  optionA: string;
  optionB: string;
  imageA: File | null;
  imageB: File | null;
};

export type CreateChoiceFormErrors = Partial<
  Record<"title" | "optionA" | "optionB" | "form", string>
>;

export type VoteOption = "A" | "B";
