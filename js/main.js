import '../ui/index.js';

// Вставьте URL веб-приложения Google Apps Script
const ENDPOINT = 'https://script.google.com/macros/s/ВАШ_ID/exec';
const MAX_SIZE = 20 * 1024 * 1024;

const $ = (id) => document.getElementById(id);

const form = $('form');
const submit = $('submit');
const fields = {
  name: $('name'),
  tg: $('tg'),
  meeting: $('meetings'),
  file: $('file'),
};

// Ошибку поля показываем только после того, как с ним поработали
const touched = new Set();

const rules = {
  name: () => (fields.name.value.trim() ? '' : 'Напиши, как тебя зовут'),
  tg: () => (fields.tg.value.trim() ? '' : 'Нужен ник в телеграм, чтобы мы могли связаться'),
  meeting: () => (fields.meeting.values.length ? '' : 'Выбери хотя бы одну встречу'),
  file: () => {
    const file = fields.file.files[0];
    if (!file) return 'Прикрепи скрин или чек';
    if (file.size > MAX_SIZE) return 'Файл больше 20 МБ';
    if (!/^image\/|application\/pdf/.test(file.type)) return 'Подойдёт картинка или PDF';
    return '';
  },
};

function refresh() {
  Object.entries(rules).forEach(([key, rule]) => {
    fields[key].error = touched.has(key) ? rule() : '';
  });
  submit.disabled = Object.values(rules).some((rule) => rule());
}

function touch(key) {
  touched.add(key);
  refresh();
}

fields.name.addEventListener('input', refresh);
fields.name.addEventListener('focusout', () => touch('name'));
fields.tg.addEventListener('input', refresh);
fields.tg.addEventListener('focusout', () => touch('tg'));
fields.meeting.addEventListener('change', () => touch('meeting'));
fields.file.addEventListener('change', () => touch('file'));

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  Object.keys(rules).forEach((key) => touched.add(key));
  refresh();
  if (submit.disabled) return;

  submit.loading = true;
  $('sendError').hidden = true;

  try {
    const file = fields.file.files[0];
    const payload = {
      name: fields.name.value.trim(),
      tg: `@${fields.tg.value.trim().replace(/^@/, '')}`,
      meetings: fields.meeting.values,
      file: { name: file.name, type: file.type, data: await toBase64(file) },
    };
    // text/plain — чтобы не было CORS-preflight, который Apps Script не поддерживает
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!json.ok) throw new Error(json.error);

    $('formWrap').hidden = true;
    $('success').hidden = false;
    $('success').classList.add('fade-in');
  } catch {
    submit.loading = false;
    const sendError = $('sendError');
    sendError.textContent = 'Не получилось отправить. Проверь интернет и попробуй ещё раз или напиши Лизе в тг @lizaediz';
    sendError.hidden = false;
  }
});
