# START HERE

Project document set: **CODEX_EDITION_2_2026-07-07**.

This folder is an autonomous handoff package for Rocket live financial dashboard Edition 2.

Edition 1 documents are included intentionally, with names like `INCLUDED_UNCHANGED_FROM_EDITION_1`, so another agent or executor can reproduce the result without the original chat history.

## Rule

Before any work in this project, read this file first. Then read the linked technical documents or notes that are relevant to the task.

Then read the relevant Edition 2 project files:

- `CODEX_EDITION_2_2026-07-07__PROTOCOL_DECISIONS_EDITION_2.md` — Edition 2 decisions.
- `CODEX_EDITION_2_2026-07-07__REQUIREMENTS.md` — Edition 2 requirements.
- `CODEX_EDITION_2_2026-07-07__BUILD_PLAYBOOK.md` — Edition 2 build algorithm.
- `CODEX_EDITION_2_2026-07-07__RESOURCE_LINKS.md` — Edition 2 links.
- `CODEX_EDITION_2_2026-07-07__CHECKPOINT.md` — Edition 2 current status.
- `CODEX_EDITION_2_2026-07-07__INCLUDED_UNCHANGED_FROM_EDITION_1__PROTOCOL_DISAGREEMENTS_TZ_Live_Dashboard_v4.md` — Edition 1 protocol, included as base context.
- `CODEX_EDITION_2_2026-07-07__INCLUDED_UNCHANGED_FROM_EDITION_1__DASHBOARD_CONFIG.md` — Edition 1 Dashboard Config notes.

## Main Goal

Build and publish Rocket live financial dashboard Edition 2. Data must come from Google Sheets through Dashboard Config and Google Apps Script. The dashboard must not be a static demo.

## Important Requirements

- Keep the earlier/original dashboard results untouched.
- Work on a separate Edition 2 publication when publishing Edition 2 results.
- Edition 1 repository: `epilipenko-byte/Codex-rocket-dashboard_presentation`
- Edition 1 GitHub Pages URL: `https://epilipenko-byte.github.io/Codex-rocket-dashboard_presentation/`
- Planned Edition 2 repository name: `rocket-finreporting-dashboard-edition-2-2026-07-07`
- Old repository must not be overwritten unless explicitly requested.
- Password for dashboard check: `password`
- Edition 2 must preserve the required dashboard coverage, with renamed/combined tabs where approved.
- Data and tabs must be live/updateable.
- Metrics must be matched by indicator names, not by fixed row/column positions.
- Matching should tolerate spaces, case differences, punctuation, and minor typos.
- Matching threshold target: 72%, with metric diagnostics shown in the tech sheet.

## Source Documents

- `docs/source/CODEX_EDITION_2_2026-07-07__INCLUDED_UNCHANGED_FROM_EDITION_1__tz_live_dashboard_v3.1.docx` — attached local project copy.
- `docs/source/CODEX_EDITION_2_2026-07-07__INCLUDED_UNCHANGED_FROM_EDITION_1__TZ_Live_Dashboard_v4.docx` — attached local project copy.
- `/Users/evgeniia/Downloads/tz_live_dashboard_v3.1.docx` — original download.
- `/Users/evgeniia/Downloads/TZ_Live_Dashboard_v4.docx` — original download.

## Local Working Copy

- `/Users/evgeniia/Documents/Codex/2026-07-06/new-chat/editions/edition-2-2026-07-07/work/rocket-dashboard`

## Key Files

- `work/rocket-dashboard/index.html`
- `work/rocket-dashboard/grass_bg.html`
- `work/rocket-dashboard/apps_script_proxy.js`
- `work/rocket-dashboard/apps_script_proxy.js`

## Current Notes

- Dashboard Config Google Sheet ID from TZ v4: `1EKR-czK1UvXZDIJUe5MLb70yZXyEMe1VIYTx15UOY3E`
- Dashboard Config URL:
  `https://docs.google.com/spreadsheets/d/1EKR-czK1UvXZDIJUe5MLb70yZXyEMe1VIYTx15UOY3E`
- Apps Script proxy URL currently used in dashboard:
  `https://script.google.com/macros/s/AKfycbxHphPAsDe6o2vvhgjmZx51CZ151J1pvuc93QxjT8hfKuAHzcVcIvKdwOAIKQBYluSl/exec`
- Edition 2 uses Executive Dark UI.
- User-facing UI must not show the word `Codex`.
- Speaker notes must be editable from the dashboard and stored outside the existing `Notes` sheet, recommended sheet name: `Speaker Notes`.
- `Total NCF — Monthly Cash Change` is the preferred total cashflow line.

## Publishing

Prefer safe GitHub publishing methods that update the Codex repository only.

If using browser-based GitHub editing, verify the raw file afterward because the web editor may visually show changes that are not actually committed.

Always verify the published GitHub Pages URL after publishing.

## Current Checkpoint

Edition 2 status is fixed in:

`CODEX_EDITION_2_2026-07-07__CHECKPOINT.md`

Do not overwrite Edition 1.

## Living Documentation Rule

After every effective correction, update:

- `CODEX_EDITION_2_2026-07-07__BUILD_PLAYBOOK.md` when the process improved.
- `CODEX_EDITION_2_2026-07-07__PROTOCOL_DECISIONS_EDITION_2.md` when behavior differs from prior requirements.
- `CODEX_EDITION_2_2026-07-07__REQUIREMENTS.md` when requirements change.
- `CODEX_EDITION_2_2026-07-07__RESOURCE_LINKS.md` when a link, file, repo, or service changes.

## Portability Goal

These Edition 2 documents must be sufficient for another agent or executor to reproduce the same dashboard work if the current chat runs out of resources or context.

Before handing the project to another agent:

1. Give it this project folder.
2. Tell it to read `AGENTS.md`, then `START_HERE.md`.
3. Tell it to follow `CODEX_EDITION_2_2026-07-07__BUILD_PLAYBOOK.md`.
4. Tell it to check `CODEX_EDITION_2_2026-07-07__RESOURCE_LINKS.md`, `CODEX_EDITION_2_2026-07-07__REQUIREMENTS.md`, and the Edition 2 protocol.
5. Tell it not to overwrite Edition 1.
6. Tell it to publish only to the approved Edition 2 path unless explicitly instructed otherwise.
