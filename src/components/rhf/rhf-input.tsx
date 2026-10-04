"use client";

import type { ComponentProps } from "react";
import { useController, type FieldPathByValue, type FieldValues } from "react-hook-form";

import { Input } from "@/design-system/input/input";
import type { RhfFieldProps } from "./types";

type RhfInputProps<T extends FieldValues, TName extends FieldPathByValue<T, string>> = Omit<
  ComponentProps<typeof Input>,
  "name" | "value" | "onChange" | "onBlur" | "error" | "ref"
> &
  RhfFieldProps<T, string, TName>;

/** Input, подключённый к react-hook-form: значение, ошибка и touched берутся из control */
export function RhfInput<T extends FieldValues, TName extends FieldPathByValue<T, string>>({
  control,
  name,
  ...rest
}: RhfInputProps<T, TName>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Input
      {...rest}
      ref={field.ref}
      name={field.name}
      value={field.value as string}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
