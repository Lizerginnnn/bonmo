import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Text } from "../text/text";
import "./checkbox.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className" | "children"> & {
  children: ReactNode;
  /** Красная рамка — когда ошибка у всей группы */
  invalid?: boolean;
};

/** Чекбокс-карточка: вся плашка кликабельна */
export function Checkbox({ children, invalid, ...rest }: CheckboxProps) {
  return (
    <label className={cn("checkbox", invalid && "checkbox--invalid")}>
      <input type="checkbox" className="checkbox__control" aria-invalid={invalid} {...rest} />
      <Text as="span" variant="body" className="checkbox__label">
        {children}
      </Text>
    </label>
  );
}
