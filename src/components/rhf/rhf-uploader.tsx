"use client";

import type { ComponentProps } from "react";
import { useController, type FieldPathByValue, type FieldValues } from "react-hook-form";

import { Uploader } from "@/design-system/uploader/uploader";
import type { RhfFieldProps } from "./types";

type RhfUploaderProps<T extends FieldValues, TName extends FieldPathByValue<T, File | null>> = Omit<
  ComponentProps<typeof Uploader>,
  "name" | "file" | "onFileChange" | "onBlur" | "error" | "ref"
> &
  RhfFieldProps<T, File | null, TName>;

/** Uploader, подключённый к react-hook-form */
export function RhfUploader<T extends FieldValues, TName extends FieldPathByValue<T, File | null>>({
  control,
  name,
  ...rest
}: RhfUploaderProps<T, TName>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Uploader
      {...rest}
      ref={field.ref}
      name={field.name}
      file={field.value as File | null}
      onFileChange={(file) => {
        field.onChange(file);
        // Ошибку показываем сразу после выбора файла, не дожидаясь blur
        field.onBlur();
      }}
      error={fieldState.error?.message}
    />
  );
}
