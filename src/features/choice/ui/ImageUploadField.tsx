"use client";

import { useEffect, useId, useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  side: "A" | "B";
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

export function ImageUploadField({
  label,
  side,
  value,
  onChange,
  disabled = false,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const accent = side === "A" ? "var(--option-a)" : "var(--option-b)";

  function pickFile(fileList: FileList | null) {
    if (disabled) return;
    const file = fileList?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    onChange(file);
  }

  function openFilePicker() {
    if (disabled) return;
    inputRef.current?.click();
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[color:var(--foreground)]"
        >
          {label}
          <span className="ml-1.5 font-normal text-[color:var(--muted)]">
            (선택)
          </span>
        </label>
        <span
          className="rounded-md px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white"
          style={{ backgroundColor: accent }}
        >
          Choice {side}
        </span>
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          pickFile(event.target.files);
          event.target.value = "";
        }}
      />

      {previewUrl && value ? (
        <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-muted)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <img
              src={previewUrl}
              alt={`${label} 미리보기`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <p className="min-w-0 truncate text-xs text-[color:var(--muted)]">
              {value.name}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={disabled}
                className="inline-flex min-h-10 items-center rounded-lg border border-[color:var(--border-strong)] bg-white px-3 py-2 text-xs font-medium touch-manipulation transition-colors hover:bg-[color:var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:px-2.5 sm:py-1.5"
              >
                교체
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={disabled}
                className="inline-flex min-h-10 items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 touch-manipulation transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:px-2.5 sm:py-1.5"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            pickFile(event.dataTransfer.files);
          }}
          className={`flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            isDragging
              ? "border-[color:var(--foreground)] bg-[color:var(--surface-muted)]"
              : "border-[color:var(--border-strong)] bg-[color:var(--surface)] hover:border-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]"
          }`}
          style={
            isDragging
              ? { boxShadow: `inset 0 0 0 1px ${accent}` }
              : undefined
          }
        >
          <span
            className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            +
          </span>
          <span className="text-sm font-medium text-[color:var(--foreground)]">
            <span className="sm:hidden">탭해서 이미지 업로드</span>
            <span className="hidden sm:inline">
              이미지를 드래그하거나 클릭해서 업로드
            </span>
          </span>
          <span className="mt-1 text-xs text-[color:var(--muted)]">
            PNG, JPG, WEBP, GIF
          </span>
        </button>
      )}
    </div>
  );
}
