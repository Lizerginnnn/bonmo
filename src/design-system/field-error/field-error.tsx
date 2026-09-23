"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import "./field-error.css";

type FieldErrorProps = {
  id?: string;
  /** Текст ошибки; пустая строка прячет блок */
  message?: string;
};

/** Сообщение об ошибке под полем. Выезжает при появлении и схлопывается при скрытии. */
export function FieldError({ id, message = "" }: FieldErrorProps) {
  // При скрытии держим последний текст, чтобы блок схлопывался вместе с ним
  const [lastMessage, setLastMessage] = useState(message);
  if (message && message !== lastMessage) setLastMessage(message);

  return (
    <div id={id} className={cn("field-error", message && "field-error--shown")} aria-live="polite">
      <span className="field-error__clip">
        <span className="field-error__text">{message || lastMessage}</span>
      </span>
    </div>
  );
}
