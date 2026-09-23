export type Registration = {
  name: string;
  /** Всегда с @ в начале */
  telegram: string;
  meetings: string[];
  receipt: File;
};

/**
 * Отправляет заявку. Единственное место, которое знает, куда уходят данные.
 *
 * TODO: подключить отправку в Telegram и в Google Таблицу.
 * Пока в режиме разработки (yarn dev) заявка печатается в консоль и считается отправленной,
 * а в собранном сайте отправка честно падает с ошибкой — чтобы никто не решил, что записался.
 */
export async function submitRegistration(registration: Registration): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.info("[dev] Заявка (отправка ещё не подключена):", registration);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return;
  }

  throw new Error("Отправка заявки ещё не подключена");
}
