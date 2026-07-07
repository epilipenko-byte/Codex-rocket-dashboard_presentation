# CODEX_EDITION_2_2026-07-07 — playbook сборки

## Перед работой

1. Прочитать `AGENTS.md`.
2. Прочитать `START_HERE.md`.
3. Прочитать `CODEX_EDITION_2_2026-07-07__PROTOCOL_DECISIONS_EDITION_2.md`.
4. Прочитать `CODEX_EDITION_2_2026-07-07__REQUIREMENTS.md`.
5. Проверить, что Edition 1 не перезаписывается.

## Алгоритм

1. Проверить Dashboard Config и доступность Apps Script proxy.
2. Обновить proxy так, чтобы он отдавал нормализованные структуры:
   - `month_keys`;
   - `financial_statements.pnl`;
   - `financial_statements.projects`;
   - `financial_statements.ludens_group`;
   - `financial_statements.cashflow`;
   - `presentation_notes`;
   - `tech_sheet`;
   - `metric_diagnostics`.
3. Обновить фронт Edition 2.
4. Проверить локально.
5. Опубликовать в отдельный GitHub Pages репозиторий с `edition-2` и датой.
6. Проверить опубликованную версию.
7. Обновить checkpoint.

## Контрольные зоны

- P&L waterfall не должен показывать маржу больше выручки из-за ошибки знаков.
- Процентные маржи должны браться из строк источника, если строки есть.
- Если Google Sheets/proxy возвращает процентные строки как доли (`0.37`), фронт обязан нормализовать их до процентов (`37%`) перед выводом.
- D/E не должен включать accounts payable и прочую операционную кредиторку.
- Cash должен соответствовать концу выбранного периода.
- Total NCF имеет приоритет над суммой трех NCF-блоков.
