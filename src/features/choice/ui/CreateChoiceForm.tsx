"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuthStore } from "@/features/auth";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { createChoiceFromForm } from "../api/choice";
import type {
  CreateChoiceFormErrors,
  CreateChoiceFormValues,
} from "../model/types";
import { validateCreateChoiceForm } from "../model/validation";
import { ImageUploadField } from "./ImageUploadField";

const initialValues: CreateChoiceFormValues = {
  title: "",
  optionA: "",
  optionB: "",
  imageA: null,
  imageB: null,
};

export function CreateChoiceForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [values, setValues] = useState<CreateChoiceFormValues>(initialValues);
  const [errors, setErrors] = useState<CreateChoiceFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof CreateChoiceFormValues>(
    key: K,
    value: CreateChoiceFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      if (key === "title" || key === "optionA" || key === "optionB") {
        delete next[key as "title" | "optionA" | "optionB"];
      }
      delete next.form;
      return next;
    });
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateCreateChoiceForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors({
        ...validationErrors,
        form: "필수 항목을 확인해 주세요.",
      });
      return;
    }

    if (!user?.id) {
      setErrors({
        form: "로그인이 필요합니다. 다시 로그인해 주세요.",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      await createChoiceFromForm(user.id, values);

      setSuccessMessage("게임 생성 완료!");
      setValues(initialValues);
      setIsSubmitting(false);

      window.setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error("[CreateChoiceForm] create failed", error);
      setErrors({
        form: toFriendlyErrorMessage(
          error,
          "게임을 만들지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      });
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-3.5 py-3 text-sm text-[color:var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--muted)] focus:border-[color:var(--foreground)] focus:shadow-[0_0_0_3px_rgba(18,24,22,0.08)]";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_40px_-32px_rgba(18,24,22,0.35)] sm:p-8"
    >
      {errors.form ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="mb-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="choice-title"
            className="text-sm font-medium text-[color:var(--foreground)]"
          >
            게임 제목 <span className="text-[color:var(--option-a)]">*</span>
          </label>
          <input
            id="choice-title"
            type="text"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="예: 주말에 어디로 갈까?"
            className={fieldClassName}
            aria-invalid={Boolean(errors.title)}
            disabled={isSubmitting}
          />
          {errors.title ? (
            <p className="text-xs text-red-600">{errors.title}</p>
          ) : null}
        </div>

        <section className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)]/70 p-4 sm:p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            선택지 A
          </h2>
          <div className="space-y-2">
            <label
              htmlFor="choice-option-a"
              className="text-sm font-medium text-[color:var(--foreground)]"
            >
              텍스트 <span className="text-[color:var(--option-a)]">*</span>
            </label>
            <input
              id="choice-option-a"
              type="text"
              value={values.optionA}
              onChange={(event) => updateField("optionA", event.target.value)}
              placeholder="예: 바다로 드라이브"
              className={fieldClassName}
              aria-invalid={Boolean(errors.optionA)}
              disabled={isSubmitting}
            />
            {errors.optionA ? (
              <p className="text-xs text-red-600">{errors.optionA}</p>
            ) : null}
          </div>
          <ImageUploadField
            label="이미지"
            side="A"
            value={values.imageA}
            onChange={(file) => updateField("imageA", file)}
            disabled={isSubmitting}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)]/70 p-4 sm:p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            선택지 B
          </h2>
          <div className="space-y-2">
            <label
              htmlFor="choice-option-b"
              className="text-sm font-medium text-[color:var(--foreground)]"
            >
              텍스트 <span className="text-[color:var(--option-a)]">*</span>
            </label>
            <input
              id="choice-option-b"
              type="text"
              value={values.optionB}
              onChange={(event) => updateField("optionB", event.target.value)}
              placeholder="예: 산속 온천"
              className={fieldClassName}
              aria-invalid={Boolean(errors.optionB)}
              disabled={isSubmitting}
            />
            {errors.optionB ? (
              <p className="text-xs text-red-600">{errors.optionB}</p>
            ) : null}
          </div>
          <ImageUploadField
            label="이미지"
            side="B"
            value={values.imageB}
            onChange={(file) => updateField("imageB", file)}
            disabled={isSubmitting}
          />
        </section>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="sticky bottom-3 z-10 mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--foreground)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(18,24,22,0.45)] touch-manipulation transition-[transform,opacity] hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:static sm:bottom-auto sm:shadow-none"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            생성 중...
          </>
        ) : (
          "게임 생성하기"
        )}
      </button>
    </form>
  );
}
