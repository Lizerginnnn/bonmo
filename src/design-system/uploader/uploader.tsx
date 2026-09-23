"use client";

import { useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { FieldError } from "../field-error/field-error";
import { Text } from "../text/text";
import "./uploader.css";

type UploaderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className" | "onChange" | "value"> & {
  label: string;
  /** Текст рядом с кнопкой, пока файл не выбран */
  hint?: string;
  /** Текст кнопки */
  buttonText?: string;
  /** Выбранный файл — его имя показывается вместо подсказки */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Текст ошибки; пустая строка — ошибки нет */
  error?: string;
};

export function Uploader({
  label,
  hint = "",
  buttonText = "Загрузить",
  file,
  onFileChange,
  error = "",
  required,
  ...rest
}: UploaderProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="uploader">
      <Text variant="label" as="p" id={labelId} className="uploader__label">
        {label}
        {required && (
          <Text as="span" tone="wine" aria-hidden="true">
            {" *"}
          </Text>
        )}
      </Text>

      <div className="uploader__row">
        <label className={cn("uploader__button", error && "uploader__button--invalid")}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 15V3M7 8l5-5 5 5M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5" />
          </svg>
          <span>{buttonText}</span>
          <input
            type="file"
            className="uploader__control"
            required={required}
            aria-labelledby={labelId}
            aria-describedby={`${hintId} ${errorId}`}
            aria-invalid={Boolean(error)}
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            {...rest}
          />
        </label>
        <Text as="span" variant="caption" id={hintId} className="uploader__file-name">
          {file ? file.name : hint}
        </Text>
      </div>

      <FieldError id={errorId} message={error} />
    </div>
  );
}
