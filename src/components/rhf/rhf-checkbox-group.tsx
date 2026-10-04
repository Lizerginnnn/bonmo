"use client";

import type { ComponentProps } from "react";
import { useController, type FieldPathByValue, type FieldValues } from "react-hook-form";

import { Checkbox } from "@/design-system/checkbox/checkbox";
import { CheckboxGroup } from "../checkbox-group/checkbox-group";
import type { RhfFieldProps } from "./types";

type RhfCheckboxGroupProps<T extends FieldValues, TName extends FieldPathByValue<T, string[]>> = Omit<
  ComponentProps<typeof CheckboxGroup>,
  "error" | "children"
> &
  RhfFieldProps<T, string[], TName> & {
    /** Варианты; в значение поля попадают отмеченные */
    options: string[];
  };

/** Группа чекбоксов, подключённая к react-hook-form; значение поля — массив отмеченных вариантов */
export function RhfCheckboxGroup<T extends FieldValues, TName extends FieldPathByValue<T, string[]>>({
  control,
  name,
  options,
  ...rest
}: RhfCheckboxGroupProps<T, TName>) {
  const { field, fieldState } = useController({ control, name });
  const selected = field.value as string[];
  const error = fieldState.error?.message;

  const toggle = (option: string, checked: boolean) => {
    field.onChange(checked ? [...selected, option] : selected.filter((item) => item !== option));
    // Ошибку показываем сразу после клика, не дожидаясь blur
    field.onBlur();
  };

  return (
    <CheckboxGroup {...rest} error={error}>
      {options.map((option, index) => (
        <Checkbox
          key={option}
          // Фокус при ошибке — на первый вариант
          ref={index === 0 ? field.ref : undefined}
          name={field.name}
          value={option}
          checked={selected.includes(option)}
          onChange={(event) => toggle(option, event.target.checked)}
          invalid={Boolean(error)}
        >
          {option}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
