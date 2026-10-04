import { z } from "zod";

import { MAX_FILE_SIZE } from "@/config/registration";

export const registrationSchema = z.object({
  name: z.string().trim().min(1, "Напиши, как тебя зовут"),
  telegram: z
    .string()
    .trim()
    .min(1, "Нужен ник в телеграм, чтобы мы могли связаться")
    // В заявку ник уходит всегда с @ в начале
    .transform((telegram) => `@${telegram.replace(/^@/, "")}`),
  meetings: z.array(z.string()).min(1, "Выбери хотя бы одну встречу"),
  // Чек необязателен, но если прикрепили — проверяем размер и тип
  receipt: z
    .custom<File | null>((value) => value === null || value instanceof File)
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Файл больше 20 МБ")
    .refine((file) => !file || /^image\/|application\/pdf/.test(file.type), "Подойдёт картинка или PDF"),
});

/** Значения полей формы */
export type FormValues = z.input<typeof registrationSchema>;
/** Проверенные и нормализованные значения — уходят в заявку */
export type ValidFormValues = z.output<typeof registrationSchema>;
