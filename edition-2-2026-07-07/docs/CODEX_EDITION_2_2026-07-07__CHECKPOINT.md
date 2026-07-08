# CODEX_EDITION_2_2026-07-07 — checkpoint

Статус: Edition 2 опубликована на GitHub Pages; Apps Script proxy Edition 2 развернут; фронт переключен на новый JSONP proxy; правки 2026-07-08 по периодам, cash, D/E, активам баланса и live-loading опубликованы и проверены на публичной GitHub Pages ссылке.

## Локально готово

- Автономный пакет Edition 2 создан.
- Edition 1 документы включены в пакет без изменений.
- Новый протокол Edition 2 создан.
- Новый requirements/playbook/resource links созданы.
- Фронт Edition 2 обновлен:
  - пользовательский UI без слова `Codex`;
  - первая вкладка переименована в `Обзор месяца`;
  - карточки `Обзор месяца` показывают последний месяц выбранного периода и сравнение с предыдущим месяцем;
  - отчетные вкладки остаются накопительными за выбранный период и показывают “в т.ч. последний месяц” в подписях карточек;
  - вкладки `Проекты Rocket`, `Ludens Group`, `Тех. лист`;
  - `Задачи` объединены с `Результаты`;
  - маржинальности в обзоре и P&L берутся как source-percent rows / fallback;
  - процентные строки источника нормализуются: если Google Sheets отдает `0.37`, фронт показывает `37%`, а не `0.37%`;
  - cash показывается как `period_end`;
  - P&L waterfall исправлен по знакам;
  - расходы сгруппированы;
  - ДДС использует `Total NCF` / fallback;
  - ДДС, баланс, трафик, проекты Rocket и Ludens Group получили раскрываемые таблицы;
  - ЦКП строится блоками: ЦКП, показатели, диаграмма, заметки докладчика;
  - `Результаты` снова показывают полный блок пороговых правил / целевых метрик;
  - `Плат.календарь` получил сигнальные карточки план/факт поступлений, выплат и cash;
  - заметки докладчика привязаны к визуальным блокам и сохраняются через Apps Script POST;
  - техлист показывает reports, matching, ссылки, ошибки и период.
- Apps Script proxy локально обновлен:
  - процентные строки;
  - `total_ncf`;
  - `dashboard_links`;
  - `speaker_notes`;
  - `tech_sheet`;
  - `write_speaker_note`.
- Apps Script proxy после утренних замечаний 2026-07-08 дополнительно исправлен:
  - D/E больше не может матчиться на строки кошельков вроде `Vivid (EUR)`;
  - D/E подтягивается из строки `Финансовый рычаг = Заемный капитал/ ср. Собственный капитал D/E`;
  - `assets_total` подтягивается из строки `Активы ↓`, а не из расчетных строк с фразой `Валюта баланса`;
  - cash подтягивается из строки `Денежные средства`;
  - `Total NCF` подтягивается из строки `NCF Изменение денег за месяц (общее)`.
- Фронт после утренних замечаний 2026-07-08 дополнительно исправлен:
  - живой ответ очищает резервные demo-поля перед заполнением, чтобы старые значения не оставались в `lt_debt/st_debt` и других KPI;
  - период по умолчанию не расширяется до частично заполненного июля только из-за cash или Total NCF;
  - default period строится по полезным P&L-месяцам;
  - если отдельные строки долга не найдены, карточка D/E показывает долг как `D/E × капитал`, а не старый резервный долг;
  - timeout live-загрузки увеличен до 180 секунд, чтобы полный proxy-ответ не выглядел как зависшая загрузка.
- Apps Script proxy JSONP deployment:
  `https://script.google.com/macros/s/AKfycbxKamFtHfX6VZZE2OcVkaPgHHygP8Ck0Pt9SrLYZeBHXDQi5Qqi-rU5dchVw2opZkAq/exec`
- Проверка proxy: HTTP `200`, возвращает `month_keys`, `total_ncf`, `tech_sheet`, `metric_diagnostics`; JSONP callback проверен через `callback=cbtest`.
- Время ответа proxy при полной живой сборке: около 60-110 секунд, поэтому фронт использует JSONP, быстро показывает кэш при наличии локального снимка и не блокирует экран.
- Проверка опубликованной страницы после JSONP: бейдж переключается с `КЭШ — Google Sheets` на `LIVE — Google Sheets`, период по умолчанию `Янв—Июн 2026`.
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

Documentation commits:

- `854b525` — `Add Edition 2 documentation package`, uploaded Markdown handoff package to `edition-2-2026-07-07/docs/`.
- `c3faf07` — `Add Edition 2 source requirements docs`, uploaded source Word TZ documents to `edition-2-2026-07-07/docs/source/`.
- `6a3f418` — `Update Edition 2 dashboard live data matching`, uploaded updated `index.html` and `apps_script_proxy.js`.
- `e65a73f` — `Update Edition 2 documentation after live checks`, uploaded updated Edition 2 documentation package.

Проверка опубликованной страницы:

- HTTP status: `200`
- title: `Rocket Finance Dashboard — Edition 2`
- парольный вход найден и проверен;
- пароль `password` принят;
- вкладки `ПРОЕКТЫ ROCKET`, `LUDENS GROUP`, `РЕЗУЛЬТАТЫ`, `ТЕХ. ЛИСТ` отображаются;
- пользовательский интерфейс не показывает слово `Codex`.
- после правок 2026-07-08 публичная страница проверена с cache-buster:
  - URL: `https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/edition-2-2026-07-07/`;
  - пароль `password` принят;
  - статус `LIVE — Google Sheets`;
  - период по умолчанию `Янв—Июн 2026`;
  - отображаются 13 вкладок;
  - карточки обзора берут последний выбранный месяц, на момент проверки июнь 2026;
  - D/E подтягивается из строки `Финансовый рычаг = Заемный капитал/ ср. Собственный капитал D/E`;
  - cash подтягивается из строки `Денежные средства`;
  - активы баланса подтягиваются из строки `Активы ↓`.

Дата проверки сайта: `2026-07-08 00:31 +03`.

Дата проверки полного GitHub-пакета: `2026-07-08 00:36 +03`.

Дата повторной проверки после утренних исправлений: `2026-07-08 13:27 +03`.

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
- Полный пакет Markdown-документации в GitHub: готово.
- Исходные Word-ТЗ в GitHub `docs/source`: готово.
- Обновленный Apps Script proxy: готово.
- Обновленный фронт: готово.
- Проверенный пароль `password`: готово.
- Проверенные периоды.
- Проверенные P&L, ДДС, D/E, маржинальности, заметки докладчика, техлист.
- Локальная контрольная проверка 2026-07-08 после правок:
  - обзор: `Янв—Июн 2026`, `LIVE — Google Sheets`, статус `обновлено`;
  - карточки обзора: выручка июнь около `$652K`, чистая прибыль около `$89K`, маржинальная рентабельность `42.2%`, операционная `15.5%`, ЧП `13.6%`, D/E около `2.28` на момент проверки, cash около `$95K`;
  - ДДС: `Total NCF` за период около `$89K`, июнь около `$84K`, таблица ДДС раскрываемая;
  - Трафик: есть раскрываемая таблица исходного листа;
  - Результаты: есть внешние dashboard-ссылки и блок `Целевые метрики и пороговые правила`;
  - ЦКП: построены блоки `ЦКП 1` ... `ЦКП 6`, у блоков есть заметки докладчика;
  - Техлист: показывает `Dashboard Config / Reports`, `Metric matching`, source URLs, ошибки и период.

## Что осталось

1. Доработать Apps Script proxy, чтобы он отдавал:
   - полную исходную таблицу трафика как `traffic_data`;
   - URL исходных Google Sheets в `raw_reports`;
   - остатки денежных средств по кошелькам из `dds_operations`.
2. После публикации проверить live-страницу:
   - `Обзор месяца`: последний месяц + сравнение к предыдущему;
   - ДДС Total NCF против строки `Total NCF — Monthly Cash Change`;
   - cash на конец выбранного периода;
   - раскрываемые таблицы на всех вкладках;
   - ЦКП по всем блокам.
