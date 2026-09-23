"use client";

import { useState, type FormEvent } from "react";

import { meetings } from "@/config/registration";
import { Button } from "@/design-system/button/button";
import { Checkbox } from "@/design-system/checkbox/checkbox";
import { Input } from "@/design-system/input/input";
import { Text } from "@/design-system/text/text";
import { Uploader } from "@/design-system/uploader/uploader";
import { submitRegistration } from "@/lib/submit-registration";
import { CheckboxGroup } from "../checkbox-group/checkbox-group";
import { PaymentInfo } from "../payment-info/payment-info";
import { fieldNames, hasErrors, validate, type FieldName, type FormValues } from "./validation";
import "./registration-form.css";

const initialValues: FormValues = { name: "", telegram: "", meetings: [], receipt: null };

type RegistrationFormProps = {
  onSent: () => void;
};

export function RegistrationForm({ onSent }: RegistrationFormProps) {
  const [values, setValues] = useState(initialValues);
  // Ошибку поля показываем только после того, как с ним поработали
  const [touched, setTouched] = useState<Set<FieldName>>(new Set());
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  const errors = validate(values);
  const shownError = (field: FieldName) => (touched.has(field) ? errors[field] : "");

  const touch = (field: FieldName) => setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));

  const update = <K extends FieldName>(field: K, value: FormValues[K]) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const toggleMeeting = (title: string, checked: boolean) => {
    update("meetings", checked ? [...values.meetings, title] : values.meetings.filter((m) => m !== title));
    touch("meetings");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(new Set(fieldNames));
    if (hasErrors(errors) || !values.receipt) return;

    setSending(true);
    setSendFailed(false);
    try {
      await submitRegistration({
        name: values.name.trim(),
        telegram: `@${values.telegram.trim().replace(/^@/, "")}`,
        meetings: values.meetings,
        receipt: values.receipt,
      });
      onSent();
    } catch (error) {
      console.error(error);
      setSendFailed(true);
      setSending(false);
    }
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Имя"
        name="name"
        autoComplete="given-name"
        required
        value={values.name}
        onChange={(event) => update("name", event.target.value)}
        onBlur={() => touch("name")}
        error={shownError("name")}
      />

      <Input
        label="Ник в телеграм"
        name="telegram"
        placeholder="@nickname"
        autoComplete="off"
        hint="(необходим для связи)"
        required
        value={values.telegram}
        onChange={(event) => update("telegram", event.target.value)}
        onBlur={() => touch("telegram")}
        error={shownError("telegram")}
      />

      <CheckboxGroup label="Выбери встречу, на которую хотите записаться" required error={shownError("meetings")}>
        {meetings.map((meeting) => (
          <Checkbox
            key={meeting.id}
            name="meetings"
            value={meeting.title}
            checked={values.meetings.includes(meeting.title)}
            onChange={(event) => toggleMeeting(meeting.title, event.target.checked)}
            invalid={Boolean(shownError("meetings"))}
          >
            {meeting.title}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <PaymentInfo />

      <Uploader
        label="Прикрепите скрин/чек, подтверждающий оплату"
        name="receipt"
        accept="image/*,.pdf"
        hint="1 файл до 20 МБ."
        required
        file={values.receipt}
        onFileChange={(file) => {
          update("receipt", file);
          touch("receipt");
        }}
        error={shownError("receipt")}
      />

      <div className="registration-form__actions">
        <Button type="submit" disabled={hasErrors(errors)} loading={sending} loadingText="Отправляем…">
          Отправить
        </Button>
        {sendFailed && (
          <Text variant="caption" tone="wine" role="alert" className="registration-form__send-error">
            Не получилось отправить. Проверь интернет и попробуй ещё раз или напиши Лизе в тг @lizaediz
          </Text>
        )}
      </div>
    </form>
  );
}
