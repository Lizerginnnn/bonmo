# bonmo-form

Форма регистрации на встречи клуба бонмо́: имя, ник в телеграм, выбор встреч, блок оплаты и загрузка чека, с живой валидацией.

Next.js со статическим экспортом (`output: 'export'`) — собирается в папку `out/` и публикуется на GitHub Pages. Стили — обычный CSS по БЭМ.

## Запуск

```sh
yarn install
yarn dev        # http://localhost:3000, с телефона в той же Wi‑Fi — http://<IP компьютера>:3000
yarn build      # статическая сборка в out/
yarn preview    # посмотреть собранный out/
yarn typecheck
```

## Структура

Файлы и папки — в kebab-case, стили — обычный CSS по БЭМ (блок называется как файл компонента), без CSS Modules и Tailwind.

```
google-apps-script/          скрипт-посредник: заявка → Telegram, и инструкция по установке
src/
  app/                       layout (шрифты, мета), страница, глобальные стили
  config/registration.ts     встречи, цены, реквизиты, контакты — править здесь
  lib/
    submit-registration.ts   отправка заявки в Google Apps Script
    cn.ts                    склейка классов
  design-system/             базовые элементы дизайна
    tokens.css               цвета, шрифты, размеры
    text/                    весь текст: variant (display, title, lead, subtitle, quote, eyebrow, label, body, meta, caption), tone, align, accent, weight
    link/  button/  input/  checkbox/  uploader/  field-error/  card/
  components/                составные компоненты и блоки страницы
    checkbox-group/          заголовок + чекбоксы + общая ошибка
    backdrop/                цветные пятна на фоне
    intro/                   шапка
    payment-info/            блок «Оплата встречи»
    registration-form/       форма и правила валидации (validation.ts)
    success-message/         экран «анкета отправлена»
    registration/            переключает форму и экран успеха
```

## Отправка заявки

Форма → Google Apps Script → Telegram (сообщение с чеком). Код скрипта и пошаговая установка — в [`google-apps-script/`](google-apps-script/README.md). На сайте только адрес скрипта, токен бота хранится в Google.

На стороне сайта отправка — в `src/lib/submit-registration.ts`, адрес берётся из `NEXT_PUBLIC_SUBMIT_ENDPOINT` (см. `.env.example`). Если адрес не задан, в `yarn dev` заявка печатается в консоль и считается отправленной, а в собранном сайте отправка падает с ошибкой, чтобы никто не решил, что записался.

## Деплой на GitHub Pages

Workflow `.github/workflows/deploy.yml` собирает сайт при пуше в `main` и публикует его.

Один раз в репозитории: **Settings → Pages → Source: GitHub Actions**. Сайт будет по адресу `https://lizerginnnn.github.io/bonmo-form/`.

Адрес скрипта — в **Settings → Secrets and variables → Actions → Variables** под именем `SUBMIT_ENDPOINT`.
