// Всё, что меняется от встречи к встрече, — здесь.

export type Meeting = {
  /** Уникальный ключ, в заявку не попадает */
  id: string;
  /** Текст на карточке; он же уходит в заявку */
  title: string;
};

export const meetings: Meeting[] = [
  { id: '2026-09-20', title: '20 сентября — Шарлотта Бронте «Джейн Эйр»' },
  {
    id: '2026-10-04',
    title: '4 октября — лекция «Реальная роль богов в жизни древних греков на примере "Одиссеи"»',
  },
];

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
