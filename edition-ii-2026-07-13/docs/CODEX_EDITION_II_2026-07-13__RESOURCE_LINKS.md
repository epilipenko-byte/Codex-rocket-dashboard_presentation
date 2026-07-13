# CODEX_EDITION_2_2026-07-07 — ресурсы

## Публикация

Путь публикации Edition 2 внутри GitHub Pages:

`edition-2-2026-07-07/`

Готовая ссылка:

`https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/edition-2-2026-07-07/`

GitHub repository:

`epilipenko-byte/Codex-rocket-dashboard_presentation`

Initial Edition 2 dashboard commit:

`3e5177ee124ff1bc9093c68d47158e334b7226fb`

Commit message:

`Add Edition 2 dashboard 2026-07-07`

Documentation commits:

- `854b525` — Markdown package uploaded to `edition-2-2026-07-07/docs/`.
- `c3faf07` — source Word TZ documents uploaded to `edition-2-2026-07-07/docs/source/`.

Live loading / Apps Script fixes:

- `5c6f0f7` — published frontend percent normalization fix for Edition 2.
- `e64c0f9` — published documentation update for live loading / cache behavior.

Проверено после live-loading исправлений: `2026-07-08 02:21 +03`.

Проверено после утренних исправлений data matching / period / balance: `2026-07-08 13:16 +03`.

Текущая версия Apps Script proxy после аудиторских правок raw-таблиц и маржинальностей: Version 33, опубликована в тот же web app URL.

Проверено 2026-07-13:

- `pnl_data` возвращается из живой вкладки `(ENG) PnL Year`;
- `payment_data` возвращается из `Свод`;
- `payment_plan_data` возвращается из `Плановый реестр`;
- `dds_operations_data` возвращает 9464 строки, без прежней обрезки на 3000;
- `op_margin_pct` матчится на `Operating margin, %`.

Готовый zip для GitHub web upload:

`CODEX_EDITION_2_2026-07-07__GITHUB_PAGES_UPLOAD.zip`

Распакованная папка для загрузки:

`publish_bundle/edition-2-2026-07-07/`

Следующая безопасная публикация после аудита 2026-07-13 должна идти отдельной папкой:

`publish_bundle/edition-2-2026-07-13/`

Ожидаемая GitHub Pages ссылка:

`https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/edition-2-2026-07-13/`

Фактическая публикация сегодняшней версии Edition II должна идти отдельной папкой:

`publish_bundle/edition-ii-2026-07-13/`

Ожидаемая GitHub Pages ссылка Edition II:

`https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/edition-ii-2026-07-13/`

Причина имени `edition-ii-2026-07-13`: пользователь попросил назвать сегодняшнюю публикацию Edition II и сохранить все предыдущие опубликованные версии как быстрый откат.

Причина выбора папки, а не нового репозитория: отдельная папка в Pages сохраняет Edition 1 без перезаписи и дает ссылку с Edition 2 в имени.

Edition 1 остается без изменений:

https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/

## Главные источники

| Ресурс | Ссылка / путь |
|---|---|
| Dashboard Config | https://docs.google.com/spreadsheets/d/1EKR-czK1UvXZDIJUe5MLb70yZXyEMe1VIYTx15UOY3E |
| Edition 2 Apps Script proxy | https://script.google.com/macros/s/AKfycbxKamFtHfX6VZZE2OcVkaPgHHygP8Ck0Pt9SrLYZeBHXDQi5Qqi-rU5dchVw2opZkAq/exec |
| Edition 1 / old Apps Script proxy | https://script.google.com/macros/s/AKfycbxHphPAsDe6o2vvhgjmZx51CZ151J1pvuc93QxjT8hfKuAHzcVcIvKdwOAIKQBYluSl/exec |
| Внедренность инструментов | https://script.google.com/macros/s/AKfycbwxYcEODuv8V9XIuXpyJ6giQOE8pXpHZITkznxqzTSuLef4HYlY1eHdwaBOvAvO8Sbh/exec |
| Тайм-менеджмент / выполнение задач | https://script.google.com/a/macros/rocketpeople.tech/s/AKfycbxTers8chtwgwkIh5cDNJI-9McA6Rj0GPSywQey0g3ygKqKSTaB9ZS8P2e5s7nopzWa/exec |

## Комплект Edition 2

Эта папка является автономным пакетом:

`/Users/evgeniia/Documents/Codex/2026-07-06/new-chat/editions/edition-2-2026-07-07`

## Проверки

- Пароль дашборда: `password`
- Проверить периоды: январь-июнь 2026 и наличие `month_keys`.
- Проверить маржинальности по строкам источника, а не расчетом фронта.
- Проверить D/E: только interest-bearing debt / equity.
- Проверить ДДС: `Total NCF — Monthly Cash Change`.
- Проверить активы баланса: строка matching должна быть `Активы ↓`.
- Проверить cash: строка matching должна быть `Денежные средства`.
- Проверить период по умолчанию: если июль частично заполнен только cash/ДДС, default должен оставаться `Янв—Июн 2026`.

## Локальные файлы Edition 2

| Файл | Назначение |
|---|---|
| `work/rocket-dashboard/index.html` | Фронт Edition 2 |
| `work/rocket-dashboard/apps_script_proxy.js` | Apps Script proxy Edition 2 |
| `work/rocket-dashboard/grass_bg.html` | Фон с травой |
| `work/rocket-dashboard/edition2-local-overview.png` | Локальный проверочный скрин |
