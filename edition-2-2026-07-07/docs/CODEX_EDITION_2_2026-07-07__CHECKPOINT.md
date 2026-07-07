# CODEX_EDITION_2_2026-07-07 — checkpoint

Статус: Edition 2 опубликована на GitHub Pages; фронт проверен по опубликованной ссылке. Осталось развернуть обновленный Apps Script proxy, чтобы все новые поля Edition 2 приходили из живого proxy.

## Локально готово

- Автономный пакет Edition 2 создан.
- Edition 1 документы включены в пакет без изменений.
- Новый протокол Edition 2 создан.
- Новый requirements/playbook/resource links созданы.
- Фронт Edition 2 обновлен:
  - пользовательский UI без слова `Codex`;
  - вкладки `Проекты Rocket`, `Ludens Group`, `Тех. лист`;
  - `Задачи` объединены с `Результаты`;
  - маржинальности в обзоре и P&L берутся как source-percent rows / fallback;
  - cash показывается как `period_end`;
  - P&L waterfall исправлен по знакам;
  - расходы сгруппированы;
  - ДДС использует `Total NCF` / fallback;
  - заметки докладчика привязаны к визуальным блокам и сохраняются через Apps Script POST;
  - техлист показывает reports, matching и период.
- Apps Script proxy локально обновлен:
  - процентные строки;
  - `total_ncf`;
  - `dashboard_links`;
  - `speaker_notes`;
  - `tech_sheet`;
  - `write_speaker_note`.
- Синтаксис `index.html` JavaScript и `apps_script_proxy.js` проверен.
- Локальный preview screenshot:
  `work/rocket-dashboard/edition2-local-overview.png`
- GitHub Pages upload bundle:
  `CODEX_EDITION_2_2026-07-07__GITHUB_PAGES_UPLOAD.zip`
- Распакованная папка для загрузки:
  `publish_bundle/edition-2-2026-07-07/`

## Публикация

Опубликовано в GitHub repository:

`epilipenko-byte/Codex-rocket-dashboard_presentation`

Папка публикации:

`edition-2-2026-07-07/`

GitHub Pages ссылка:

`https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/edition-2-2026-07-07/`

Commit:

`3e5177ee124ff1bc9093c68d47158e334b7226fb`

Commit message:

`Add Edition 2 dashboard 2026-07-07`

Проверка опубликованной страницы:

- HTTP status: `200`
- title: `Rocket Finance Dashboard — Edition 2`
- парольный вход найден и проверен;
- пароль `password` принят;
- вкладки `ПРОЕКТЫ ROCKET`, `LUDENS GROUP`, `РЕЗУЛЬТАТЫ`, `ТЕХ. ЛИСТ` отображаются;
- пользовательский интерфейс не показывает слово `Codex`.

Дата проверки: `2026-07-08 00:31 +03`.

## История публикации

Ранее был подготовлен локальный git commit в:

`/tmp/rocket-edition2-publish`

Push не выполнен, потому что терминал не имеет GitHub credentials:

`fatal: could not read Username for 'https://github.com': terminal prompts disabled`

После паузы временный clone `/tmp/rocket-edition2-publish` может отсутствовать, но исходные файлы и upload bundle сохранены в пакете Edition 2.

GitHub connector также не смог записать файл в репозиторий:

`GitHub API error 403: Resource not accessible by integration`

Это означает, что доступный коннектор имеет недостаточно прав для записи в этот репозиторий.

GitHub web upload открыт в Chrome по адресу:

`https://github.com/epilipenko-byte/Codex-rocket-dashboard_presentation/upload/main/edition-2-2026-07-07`

Файлы для выбора:

- `publish_bundle/edition-2-2026-07-07/index.html`
- `publish_bundle/edition-2-2026-07-07/grass_bg.html`
- `publish_bundle/edition-2-2026-07-07/apps_script_proxy.js`

Попытка программной загрузки через Chrome file chooser остановлена ограничением расширения:

`fileChooser.setFiles failed: Not allowed`

Для автоматической загрузки файлов через Chrome нужно включить разрешение расширения Codex:

`chrome://extensions` -> Codex -> Details -> `Allow access to file URLs`.

Также macOS не разрешила агенту управлять системным окном выбора файлов без Accessibility permission для `osascript`.

После включения разрешения Chrome на локальные файлы web upload через GitHub сработал.

## Должно быть готово перед финальной передачей

- Отдельная GitHub Pages ссылка Edition 2: готово.
- Отдельная публикация с `edition-2` и датой в имени: готово.
- Обновленный Apps Script proxy.
- Обновленный фронт: готово.
- Проверенный пароль `password`: готово.
- Проверенные периоды.
- Проверенные P&L, ДДС, D/E, маржинальности, заметки докладчика, техлист.

## Что осталось

1. Развернуть обновленный `apps_script_proxy.js` в Google Apps Script для Edition 2.
2. Проверить живые данные после обновления proxy:
   - `month_keys`;
   - `margin_pct/op_margin_pct/np_margin_pct`;
   - `total_ncf`;
   - `dashboard_links`;
   - `speaker_notes`;
   - `tech_sheet`.
