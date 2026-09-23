/**
 * Приём заявок с формы бонмо́:
 *   1. строка в Google Таблице + чек в папке на Google Диске;
 *   2. сообщение с чеком в Telegram.
 *
 * Настройки хранятся в Project Settings → Script properties:
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата, куда приходят заявки (узнать — функцией showChatIds)
 *   SPREADSHEET_ID     — таблица с заявками   } создаются функцией setupSpreadsheet,
 *   RECEIPTS_FOLDER_ID — папка с чеками       } или впишите id своих заранее
 *
 * Как установить — google-apps-script/README.md.
 * После изменения кода: Deploy → Manage deployments → ✎ → Version: New version → Deploy.
 */

// Функции с _ на конце — внутренние: Apps Script не показывает их в списке для запуска

const TIME_ZONE = "Europe/Moscow";
const SHEET_NAME = "Заявки";
const HEADERS = ["Дата", "Имя", "Телеграм", "Встречи", "Чек"];

// Лимит подписи к файлу в Telegram
const CAPTION_LIMIT = 1024;

/** Сюда форма отправляет заявку */
function doPost(e) {
  try {
    const registration = parseRegistration_(e);
    const now = new Date();
    const receipt = decodeReceipt_(registration, now);

    // Таблица — главное хранилище: если сохранить не вышло, человек увидит ошибку и отправит ещё раз
    const rowUrl = saveToSpreadsheet_(registration, receipt, now);

    // Уведомление — дополнительно: заявка уже сохранена, поэтому сбой Telegram не показываем,
    // иначе человек отправит заявку повторно и в таблице будет дубль
    try {
      const { token, chatId } = getTelegramSettings_();
      sendToTelegram_(
        token,
        chatId,
        formatMessage_(registration, rowUrl),
        receipt,
      );
    } catch (error) {
      console.error(
        "Заявка сохранена в таблицу, но не отправлена в Telegram:",
        error,
      );
    }

    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  }
}

function parseRegistration_(e) {
  if (!e || !e.postData) throw new Error("Пустой запрос");
  const data = JSON.parse(e.postData.contents);

  const name = String(data.name || "").trim();
  const telegram = String(data.telegram || "").trim();
  const meetings = Array.isArray(data.meetings)
    ? data.meetings.map(String)
    : [];
  const receipt = data.receipt;

  if (!name || !telegram || !meetings.length)
    throw new Error("Не заполнены обязательные поля");
  if (!receipt || !receipt.data) throw new Error("Нет чека");

  return { name, telegram, meetings, receipt };
}

/** Файл чека с понятным именем — одинаковым в Telegram и в папке на Диске */
function decodeReceipt_({ name, receipt }, date) {
  return Utilities.newBlob(
    Utilities.base64Decode(receipt.data),
    receipt.type || "application/octet-stream",
    receiptFileName_(name, date, receipt.name || "чек"),
  );
}

/** «Имя (23.09.2026 23-10) (исходное название).расширение» */
function receiptFileName_(name, date, originalName) {
  const dot = originalName.lastIndexOf(".");
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  const extension = dot > 0 ? originalName.slice(dot) : "";
  const when = Utilities.formatDate(date, TIME_ZONE, "dd.MM.yyyy HH-mm");
  return `${safeFileName_(name)} (${when}) (${safeFileName_(base)})${extension}`;
}

/** Убирает символы, которые нельзя использовать в именах файлов */
function safeFileName_(text) {
  return (
    text
      .replace(/[\\/:*?"<>|\n\r\t]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "без имени"
  );
}

// ——— Таблица ———

/** Сохраняет заявку и возвращает ссылку на её строку в таблице */
function saveToSpreadsheet_({ name, telegram, meetings }, receipt, now) {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("SPREADSHEET_ID");
  const folderId = props.getProperty("RECEIPTS_FOLDER_ID");
  if (!spreadsheetId || !folderId)
    throw new Error("Таблица не настроена: запустите setupSpreadsheet");

  const file = DriveApp.getFolderById(folderId).createFile(receipt.copyBlob());

  const sheet =
    SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`В таблице нет листа «${SHEET_NAME}»`);

  // Блокировка — чтобы две одновременные заявки не перепутали строки при добавлении ссылки на чек
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  let row;
  try {
    sheet.appendRow([
      now,
      asText_(name),
      asText_(telegram),
      asText_(meetings.join("\n")),
      "",
    ]);
    row = sheet.getLastRow();
    const link = SpreadsheetApp.newRichTextValue()
      .setText("открыть")
      .setLinkUrl(file.getUrl())
      .build();
    sheet.getRange(row, HEADERS.indexOf("Чек") + 1).setRichTextValue(link);
  } finally {
    lock.releaseLock();
  }

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheet.getSheetId()}&range=A${row}`;
}

/** Текст, который таблица не примет за формулу или число (например, «=…» или «+7…») */
function asText_(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

// ——— Telegram ———

function getTelegramSettings_() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");
  if (!token)
    throw new Error("В Script properties не задан TELEGRAM_BOT_TOKEN");
  if (!chatId) throw new Error("В Script properties не задан TELEGRAM_CHAT_ID");
  return { token, chatId };
}

function sendToTelegram_(token, chatId, text, receipt) {
  // Обычно заявка — одно сообщение: чек с подписью. Если текст не влезает в подпись — два сообщения.
  if (text.length <= CAPTION_LIMIT) {
    callTelegram_(token, "sendDocument", {
      chat_id: chatId,
      document: receipt,
      caption: text,
      parse_mode: "HTML",
    });
  } else {
    callTelegram_(token, "sendMessage", {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    });
    callTelegram_(token, "sendDocument", {
      chat_id: chatId,
      document: receipt,
    });
  }
}

function formatMessage_({ name, telegram, meetings }, rowUrl) {
  return [
    "<b>Новая заявка на встречу</b>",
    "",
    `<b>Имя:</b> ${escapeHtml_(name)}`,
    `<b>Телеграм:</b> ${escapeHtml_(telegram)}`,
    "<b>Встречи:</b>",
    ...meetings.map((meeting) => `• ${escapeHtml_(meeting)}`),
    "",
    `<a href="${escapeHtml_(rowUrl)}">Открыть в таблице</a>`,
  ].join("\n");
}

function callTelegram_(token, method, payload) {
  const response = UrlFetchApp.fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "post",
      payload: payload,
      muteHttpExceptions: true,
    },
  );
  const result = JSON.parse(response.getContentText());
  if (!result.ok) throw new Error(`Telegram ${method}: ${result.description}`);
  return result.result;
}

function escapeHtml_(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// ——— Запускать вручную из редактора ———

/**
 * Готовит таблицу и папку для чеков и запоминает их в Script properties.
 *
 * Свои таблицу или папку можно указать заранее — вписать их id в SPREADSHEET_ID / RECEIPTS_FOLDER_ID
 * (id — часть ссылки: docs.google.com/spreadsheets/d/<id>/…, drive.google.com/drive/folders/<id>).
 * Что не указано — создаётся на вашем Google Диске: таблица «бонмо — заявки», папка «бонмо — чеки».
 * В таблице появится лист «Заявки» с заголовками, если его ещё нет. Повторный запуск ничего не пересоздаёт.
 */
function setupSpreadsheet() {
  const props = PropertiesService.getScriptProperties();

  const spreadsheetId = props.getProperty("SPREADSHEET_ID");
  const spreadsheet = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.create("бонмо — заявки");
  if (!spreadsheetId) {
    spreadsheet.setSpreadsheetTimeZone(TIME_ZONE);
    // В новой таблице переименовываем пустой лист по умолчанию
    spreadsheet.getSheets()[0].setName(SHEET_NAME);
    props.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  }
  if (!spreadsheet.getSheetByName(SHEET_NAME))
    spreadsheet.insertSheet(SHEET_NAME);
  prepareSheet_(spreadsheet.getSheetByName(SHEET_NAME));

  let folderId = props.getProperty("RECEIPTS_FOLDER_ID");
  if (!folderId) {
    folderId = DriveApp.createFolder("бонмо — чеки").getId();
    props.setProperty("RECEIPTS_FOLDER_ID", folderId);
  }

  console.log(`Таблица: ${spreadsheet.getUrl()}`);
  console.log(`Папка с чеками: ${DriveApp.getFolderById(folderId).getUrl()}`);
}

/** Заголовки и оформление листа с заявками — только если лист ещё пустой */
function prepareSheet_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A2:A").setNumberFormat("dd.MM.yyyy HH:mm");
  sheet.getRange("A:E").setVerticalAlignment("top");
  sheet.getRange("D:D").setWrap(true);
  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 420);
  sheet.setColumnWidth(5, 90);
}

/** Показывает в журнале чаты, где недавно писали боту, с их id — оттуда берётся TELEGRAM_CHAT_ID */
function showChatIds() {
  const token =
    PropertiesService.getScriptProperties().getProperty("TELEGRAM_BOT_TOKEN");
  if (!token)
    throw new Error("Сначала задайте TELEGRAM_BOT_TOKEN в Script properties");

  const updates = callTelegram_(token, "getUpdates", {});
  const chats = {};
  updates.forEach((update) => {
    const message =
      update.message || update.channel_post || update.my_chat_member || {};
    const chat = message.chat;
    if (chat)
      chats[chat.id] =
        chat.title ||
        [chat.first_name, chat.last_name].filter(Boolean).join(" ") ||
        chat.username;
  });

  const ids = Object.keys(chats);
  if (!ids.length) {
    console.log(
      "Чатов не найдено. Напишите боту /start (или добавьте его в группу и напишите там что-нибудь) и запустите снова.",
    );
    return;
  }
  ids.forEach((id) => console.log(`${id} — ${chats[id]}`));
}

/** Присылает тестовое сообщение — проверка, что токен и chat id верные */
function sendTestMessage() {
  const { token, chatId } = getTelegramSettings_();
  callTelegram_(token, "sendMessage", {
    chat_id: chatId,
    text: "Проверка: бот формы бонмо́ подключён ♥",
  });
  console.log("Отправлено");
}
