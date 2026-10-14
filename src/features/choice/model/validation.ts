import type { CreateChoiceFormErrors, CreateChoiceFormValues } from "./types";

export function validateCreateChoiceForm(
  values: CreateChoiceFormValues,
): CreateChoiceFormErrors {
  const errors: CreateChoiceFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "게임 제목을 입력해 주세요.";
  }

  if (!values.optionA.trim()) {
    errors.optionA = "선택지 A 텍스트를 입력해 주세요.";
  }

  if (!values.optionB.trim()) {
    errors.optionB = "선택지 B 텍스트를 입력해 주세요.";
  }

  return errors;
}
