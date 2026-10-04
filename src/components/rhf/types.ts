import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

/** Общие пропсы rhf-обёрток: control из useForm и имя поля, значение которого имеет тип TValue */
export type RhfFieldProps<T extends FieldValues, TValue, TName extends FieldPathByValue<T, TValue>> = {
  // Обёртке не важны context и тип значений после резолвера
  control: Control<T, any, any>;
  name: TName;
};
