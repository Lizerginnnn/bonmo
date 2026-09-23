"use client";

import { useState } from "react";

import { Intro } from "../intro/intro";
import { RegistrationForm } from "../registration-form/registration-form";
import { SuccessMessage } from "../success-message/success-message";

/** Шапка с формой, а после отправки — экран «анкета отправлена» */
export function Registration() {
  const [sent, setSent] = useState(false);

  if (sent) return <SuccessMessage />;

  return (
    <>
      <Intro />
      <RegistrationForm onSent={() => setSent(true)} />
    </>
  );
}
