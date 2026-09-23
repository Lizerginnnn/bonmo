"use client";

import { useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { FieldError } from "../field-error/field-error";
import { Text } from "../text/text";
import "./input.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  /** Подсказка под полем */
  hint?: string;
  /** Текст ошибки; пустая строка — ошибки нет */
  error?: string;
};

export function Input({ label, hint, error = "", required, type = "text", ...rest }: InputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="input">
      <label htmlFor={id}>
        <Text variant="label" className="input__label">
          {label}
          {required && (
          <Text as="span" tone="wine" aria-hidden="true">
            {" *"}
          </Text>
        )}
        </Text>
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className={cn("input__control", error && "input__control--invalid")}
        aria-invalid={Boolean(error)}
        aria-describedby={cn(hint && hintId, errorId)}
        {...rest}
      />
      {hint && (
        <Text variant="caption" id={hintId} className="input__hint">
          {hint}
        </Text>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
