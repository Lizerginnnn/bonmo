/** Склеивает классы, пропуская пустые: cn("input__control", error && "input__control--invalid") */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
