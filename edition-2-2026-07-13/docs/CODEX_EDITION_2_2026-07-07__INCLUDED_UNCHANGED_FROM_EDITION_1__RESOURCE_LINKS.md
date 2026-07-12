# Ресурсы проекта

Этот файл хранит ссылки и локальные вложения для проекта **Дашборд презентация финансовой отчетности**.

## Главные рабочие ссылки

| Ресурс | Ссылка / путь | Назначение |
|---|---|---|
| Codex GitHub Pages | https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/ | Опубликованная Codex-версия дашборда |
| Codex GitHub repository | https://github.com/epilipenko-byte/Codex-rocket-dashboard_presentation | Отдельный репозиторий, созданный Codex. Старую версию не затирать |
| Старый GitHub Pages | https://epilipenko-byte.github.io/-rocket-dashboard_presentation/ | Исходная/предыдущая версия, не менять без прямого запроса |
| Старый GitHub repository | https://github.com/epilipenko-byte/-rocket-dashboard_presentation | Исходный репозиторий |
| Dashboard Config | https://docs.google.com/spreadsheets/d/1EKR-czK1UvXZDIJUe5MLb70yZXyEMe1VIYTx15UOY3E | Управляющая таблица: Reports, Notes, AI Analysis, Threshold Rules, Assumptions |
| Apps Script Data Proxy | https://script.google.com/macros/s/AKfycbxHphPAsDe6o2vvhgjmZx51CZ151J1pvuc93QxjT8hfKuAHzcVcIvKdwOAIKQBYluSl/exec | Живой JSON для дашборда |
| Внедренность инструментов Apps Script | https://script.google.com/macros/s/AKfycbwxYcEODuv8V9XIuXpyJ6giQOE8pXpHZITkznxqzTSuLef4HYlY1eHdwaBOvAvO8Sbh/exec | Блок результатов/инструментов |
| Make.com AI Analysis | https://eu1.make.com/1742377/scenarios/5971121/edit | По ТЗ v4 Make.com остается для AI Analysis |
| Эталон 1 | https://drive.google.com/file/d/1_ijZ4K2Nml3ifqFAxHTUXadt7dBTlyW3/view | Вкладки, навигация, шрифты |
| Эталон 2 | https://drive.google.com/file/d/1tOscvFxh72YswzkDkxvf4xflVBPH78Wh/view | Аналитика, выводы |

## Локальные файлы проекта

| Файл | Назначение |
|---|---|
| `docs/source/CODEX_EDITION_1_2026-07-07__tz_live_dashboard_v3.1.docx` | ТЗ v3.1, приложено в проект |
| `docs/source/CODEX_EDITION_1_2026-07-07__TZ_Live_Dashboard_v4.docx` | Изменения/ТЗ v4, приложено в проект |
| `work/tz_extracted/CODEX_EDITION_1_2026-07-07__tz_live_dashboard_v3.1.txt` | Извлеченный текст ТЗ v3.1 для быстрого чтения |
| `work/tz_extracted/CODEX_EDITION_1_2026-07-07__TZ_Live_Dashboard_v4.txt` | Извлеченный текст ТЗ v4 для быстрого чтения |
| `work/rocket-dashboard/index.html` | Главный файл дашборда |
| `work/rocket-dashboard/grass_bg.html` | Three.js фон с травой |
| `work/rocket-dashboard/apps_script_proxy.js` | Google Apps Script Data Proxy |
| `work/rocket-dashboard/CODEX_EDITION_1_2026-07-07__SETUP_INSTRUCTIONS.md` | Техническая инструкция по Apps Script |

## Файлы для передачи другому агенту или другой рабочей сессии

Чтобы другой агент мог восстановить работу, передавать всю папку проекта:

`/Users/evgeniia/Documents/Codex/2026-07-06/new-chat`

Критически важные файлы внутри нее:

| Файл | Зачем нужен |
|---|---|
| `AGENTS.md` | Локальные правила проекта |
| `START_HERE.md` | Главный вход и навигатор |
| `CODEX_EDITION_1_2026-07-07__RESOURCE_LINKS.md` | Все ссылки и пути |
| `CODEX_EDITION_1_2026-07-07__DASHBOARD_CONFIG.md` | Логика Dashboard Config |
| `CODEX_EDITION_1_2026-07-07__DASHBOARD_BUILD_PLAYBOOK.md` | Алгоритм повторения результата |
| `CODEX_EDITION_1_2026-07-07__PROTOCOL_DISAGREEMENTS_TZ_Live_Dashboard_v4.md` | Принятые отклонения от ТЗ |
| `CODEX_EDITION_1_2026-07-07__DASHBOARD_DESIGN_SKILLS.md` | Правила оформления |
| `CODEX_EDITION_1_2026-07-07__PROJECT_CHECKPOINT_READY_DASHBOARD.md` | Зафиксированный готовый вариант и что нельзя менять |
| `CODEX_EDITION_1_2026-07-07__REPRODUCE_SECOND_DASHBOARD_PROMPT.md` | Готовое стартовое задание для второго дашборда |
| `docs/source/*.docx` | Приложенные ТЗ |
| `work/rocket-dashboard/*` | Код дашборда и Apps Script |

## Быстрые проверки

- Пароль дашборда: `password`
- Проверка живого прокси: открыть Apps Script Data Proxy с `?action=get_all&client=codex_debug`
- Проверка опубликованного HTML: открыть GitHub Pages с параметром кэша, например `?v=timestamp`
- После публикации всегда проверять:
  - виден экран входа;
  - есть 13 вкладок;
  - нет надписи `DEMO — тестовые данные`;
  - вкладка `Задачи` показывает реальные строки;
  - Dashboard Config/Google Sheets отдают живые данные.
