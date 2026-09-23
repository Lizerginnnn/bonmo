import type { ButtonHTMLAttributes } from "react";

import "./button.css";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  /** Спиннер вместо текста; кнопка заблокирована */
  loading?: boolean;
  /** Текст во время загрузки */
  loadingText?: string;
};

export function Button({ loading, loadingText, disabled, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className="button" disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading && <span className="button__spinner" aria-hidden="true" />}
      <span className="button__text">{loading && loadingText ? loadingText : children}</span>
    </button>
  );
}
