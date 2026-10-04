"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { meetings } from "@/config/registration";
import { Button } from "@/design-system/button/button";
import { Text } from "@/design-system/text/text";
import { submitRegistration } from "@/lib/submit-registration";
import { PaymentInfo } from "../payment-info/payment-info";
import { RhfCheckboxGroup } from "../rhf/rhf-checkbox-group";
import { RhfInput } from "../rhf/rhf-input";
import { RhfUploader } from "../rhf/rhf-uploader";
import { registrationSchema, type FormValues, type ValidFormValues } from "./validation";
import "./registration-form.css";

const defaultValues: FormValues = { name: "", telegram: "", meetings: [], receipt: null };

type RegistrationFormProps = {
  onSent: () => void;
};

export function RegistrationForm({ onSent }: RegistrationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormValues, unknown, ValidFormValues>({
    resolver: zodResolver(registrationSchema),
    // Ошибку поля показываем только после того, как с ним поработали
    mode: "onTouched",
    defaultValues,
  });
  const [sendFailed, setSendFailed] = useState(false);

  async function onSubmit(values: ValidFormValues) {
    setSendFailed(false);
    try {
      await submitRegistration(values);
      onSent();
    } catch (error) {
      console.error(error);
      setSendFailed(true);
    }
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <RhfInput control={control} name="name" label="Имя" autoComplete="given-name" required />

      <RhfInput
        control={control}
        name="telegram"
        label="Ник в телеграм"
        placeholder="@nickname"
        autoComplete="off"
        hint="(необходим для связи)"
        required
      />

      <RhfCheckboxGroup
        control={control}
        name="meetings"
        label="Выбери встречу, на которую хотите записаться"
        options={meetings}
        required
      />

      <PaymentInfo />

      <RhfUploader
        control={control}
        name="receipt"
        label="Прикрепите скрин/чек, подтверждающий оплату"
        accept="image/*,.pdf"
        hint="1 файл до 20 МБ."
      />

      <div className="registration-form__actions">
        <Button type="submit" disabled={!isValid} loading={isSubmitting} loadingText="Отправляем…">
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
