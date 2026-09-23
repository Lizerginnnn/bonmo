import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import "./text.css";

export type TextVariant =
  | "display" // главный заголовок страницы
  | "title" // заголовок блока
  | "lead" // вводный абзац
  | "subtitle" // крупный абзац
  | "quote" // крупная курсивная фраза
  | "eyebrow" // курсивная надпись над заголовком
  | "label" // подпись поля
  | "body" // обычный текст
  | "meta" // второстепенный текст
  | "caption"; // подсказка под полем

export type TextTone = "ink" | "muted" | "soft" | "wine" | "night";

const defaultTag: Record<TextVariant, ElementType> = {
  display: "h1",
  title: "h2",
  lead: "p",
  subtitle: "p",
  quote: "p",
  eyebrow: "p",
  label: "span",
  body: "p",
  meta: "p",
  caption: "p",
};

type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: TextVariant;
  /** Тег вместо стандартного для варианта */
  as?: ElementType;
  /** Цвет; по умолчанию — цвет варианта */
  tone?: TextTone;
  align?: "start" | "center";
  /** Акцентный шрифт — Playfair Display курсивом */
  accent?: boolean;
  weight?: "regular" | "medium";
};

export function Text({
  variant = "body",
  as,
  tone,
  align,
  accent,
  weight,
  className,
  ...rest
}: TextProps) {
  const Tag = as ?? defaultTag[variant];

  return (
    <Tag
      className={cn(
        "text",
        `text--${variant}`,
        tone && `text--tone-${tone}`,
        align && `text--align-${align}`,
        accent && "text--accent",
        weight && `text--weight-${weight}`,
        className,
      )}
      {...rest}
    />
  );
}
