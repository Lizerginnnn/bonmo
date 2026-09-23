import { MAX_FILE_SIZE } from "@/config/registration";

export type FormValues = {
  name: string;
  telegram: string;
  meetings: string[];
  receipt: File | null;
};

export type FieldName = keyof FormValues;
export type FormErrors = Record<FieldName, string>;

const rules: Record<FieldName, (values: FormValues) => string> = {
  name: ({ name }) => (name.trim() ? "" : "Напиши, как тебя зовут"),
  telegram: ({ telegram }) => (telegram.trim() ? "" : "Нужен ник в телеграм, чтобы мы могли связаться"),
  meetings: ({ meetings }) => (meetings.length ? "" : "Выбери хотя бы одну встречу"),
  receipt: ({ receipt }) => {
    if (!receipt) return "Прикрепи скрин или чек";
    if (receipt.size > MAX_FILE_SIZE) return "Файл больше 20 МБ";
    if (!/^image\/|application\/pdf/.test(receipt.type)) return "Подойдёт картинка или PDF";
    return "";
  },
};

export const fieldNames = Object.keys(rules) as FieldName[];

export function validate(values: FormValues): FormErrors {
  return Object.fromEntries(fieldNames.map((field) => [field, rules[field](values)])) as FormErrors;
}

export function hasErrors(errors: FormErrors) {
  return Object.values(errors).some(Boolean);
}
