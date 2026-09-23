import type { ReactNode } from "react";

import { FieldError } from "@/design-system/field-error/field-error";
import { Text } from "@/design-system/text/text";
import "./checkbox-group.css";

type CheckboxGroupProps = {
  label: string;
  required?: boolean;
  /** Общая ошибка группы; пустая строка — ошибки нет */
  error?: string;
  /** Checkbox-ы */
  children: ReactNode;
};

export function CheckboxGroup({ label, required, error = "", children }: CheckboxGroupProps) {
  return (
    <fieldset className="checkbox-group">
      <Text as="legend" variant="label" className="checkbox-group__label">
        {label}
        {required && (
          <Text as="span" tone="wine" aria-hidden="true">
            {" *"}
          </Text>
        )}
      </Text>
      <div className="checkbox-group__options">{children}</div>
      <FieldError message={error} />
    </fieldset>
  );
}
