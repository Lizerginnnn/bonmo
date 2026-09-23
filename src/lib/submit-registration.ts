export type Registration = {
  name: string;
  /** Всегда с @ в начале */
  telegram: string;
  meetings: string[];
  receipt: File;
};

/** Адрес веб-приложения Google Apps Script (google-apps-script/code.gs) */
const endpoint = process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT;

/**
 * Отправляет заявку в Google Apps Script, а он — в Telegram.
 *
 * Если адрес не задан: в yarn dev заявка печатается в консоль и считается отправленной,
 * а в собранном сайте отправка падает с ошибкой — чтобы никто не решил, что записался.
 */
export async function submitRegistration(registration: Registration): Promise<void> {
  if (!endpoint) {
    if (process.env.NODE_ENV === "development") {
      console.info("[dev] NEXT_PUBLIC_SUBMIT_ENDPOINT не задан, заявка не отправлена:", registration);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return;
    }
    throw new Error("Не задан NEXT_PUBLIC_SUBMIT_ENDPOINT");
  }

  const { receipt, ...fields } = registration;
  const payload = {
    ...fields,
    receipt: { name: receipt.name, type: receipt.type, data: await toBase64(receipt) },
  };

  // text/plain — чтобы браузер не делал CORS-preflight, который Apps Script не поддерживает
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const result: { ok: boolean; error?: string } = await response.json();
  if (!result.ok) throw new Error(result.error ?? "Apps Script вернул ошибку");
}

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
