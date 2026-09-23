import liza from "../../LIZA.json";

// Встречи редактируются в LIZA.json в корне проекта

/** Встречи на форме; текст встречи уходит в заявку как есть */
export const meetings: string[] = readMeetings(liza);

function readMeetings(data: { meetings?: unknown }): string[] {
  const list = data.meetings;
  // Проверка при сборке: если в LIZA.json ошибка, сайт не соберётся и старая версия останется на месте
  if (!Array.isArray(list) || !list.length || !list.every((item) => typeof item === "string" && item.trim())) {
    throw new Error('LIZA.json: в "meetings" должен быть список встреч — непустых строк в кавычках через запятую');
  }
  return list.map((item: string) => item.trim());
}

export const payment = {
  phone: '89277253574',
  recipient: 'АЛЬФА БАНК елизавета андреевна к.',
  price: '700₽',
  firstMeetingPrice: '490₽',
};

export const contacts = {
  channelUrl: 'https://t.me/bonmo_club',
  channelLabel: 't.me/bonmo_club',
  organizerUrl: 'https://t.me/lizaediz',
  organizerHandle: '@lizaediz',
};

/** Максимальный размер чека */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
