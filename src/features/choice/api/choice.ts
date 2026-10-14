import { createBrowserClient } from "@/shared/api";
import type { CreateChoiceFormValues } from "../model/types";
import { uploadGameImage } from "./storage";

export type CreateChoiceInput = {
  authorId: string;
  title: string;
  optionA: string;
  optionB: string;
  imageA: File | null;
  imageB: File | null;
};

export type CreatedChoice = {
  id: string;
  title: string;
  option_a_text: string;
  option_b_text: string;
  option_a_image_url: string | null;
  option_b_image_url: string | null;
};

export async function createChoice(
  input: CreateChoiceInput,
): Promise<CreatedChoice> {
  const supabase = createBrowserClient();

  const [optionAImageUrl, optionBImageUrl] = await Promise.all([
    input.imageA
      ? uploadGameImage(input.authorId, input.imageA, "A")
      : Promise.resolve(null),
    input.imageB
      ? uploadGameImage(input.authorId, input.imageB, "B")
      : Promise.resolve(null),
  ]);

  const { data, error } = await supabase
    .from("games")
    .insert({
      author_id: input.authorId,
      title: input.title.trim(),
      option_a_text: input.optionA.trim(),
      option_b_text: input.optionB.trim(),
      option_a_image_url: optionAImageUrl,
      option_b_image_url: optionBImageUrl,
    })
    .select(
      "id, title, option_a_text, option_b_text, option_a_image_url, option_b_image_url",
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createChoiceFromForm(
  authorId: string,
  values: CreateChoiceFormValues,
) {
  return createChoice({
    authorId,
    title: values.title,
    optionA: values.optionA,
    optionB: values.optionB,
    imageA: values.imageA,
    imageB: values.imageB,
  });
}

export { voteChoice } from "./vote";
