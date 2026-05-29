# Family Registry App - Project Pack

This project pack defines a production-ready, local-first family registry application with multilingual UI support, a single connected database of people, relationship graph views, search, and date-based reminders.

The documents are intended to be handed directly to a developer without requiring further clarification.

## Documents

- [PRD.md](PRD.md) - product requirements, users, features, scope, and acceptance criteria.
- [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) - recommended architecture, stack, APIs, security, deployment, and testing.
- [DATA_MODEL.md](DATA_MODEL.md) - database schema, relationships, indexes, date handling, and data rules.
- [UI_UX_SPEC.md](UI_UX_SPEC.md) - screen layout, workflows, multilingual behavior, and visual requirements.
- [I18N_SPEC.md](I18N_SPEC.md) - English, Urdu, Gujarati localization model and translation keys.
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - phased build plan and milestone deliverables.
- [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) - testable completion checklist.
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - current phase, scope boundaries, and operating status.
- [QUALITY_PLAN.md](QUALITY_PLAN.md) - quality gates, self-audit loop, and verification rules.
- [CHECKPOINTS.md](CHECKPOINTS.md) - phase checkpoints, exit criteria, and release tags.
- [RISK_REGISTER.md](RISK_REGISTER.md) - tracked project risks and mitigations.
- [DECISION_LOG.md](DECISION_LOG.md) - architecture and product decisions.
- [EVAL_PLAN.md](EVAL_PLAN.md) - stress, quality, privacy, and regression evaluation plan.
- [RELEASE_PLAN.md](RELEASE_PLAN.md) - versioning, release, tag, and rollback rules.
- [SECURITY_PRIVACY_GUARDRAILS.md](SECURITY_PRIVACY_GUARDRAILS.md) - public repository safety rules.
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - local development and runtime setup.
- [docs/DATABASE.md](docs/DATABASE.md) - SQLite migration and fake seed data guide.
- [docs/API.md](docs/API.md) - current backend API endpoints.

## Product Summary

Build a slim, efficient family knowledge app for extended family data. The database schema and internal field names are English. The user interface supports English, Urdu, and Gujarati. The app stores people, birth/death metadata, spouses, parents, children, grandchildren, photos, notes, and sources. It provides search by any major field, a family tree, a knowledge graph, and birthday/death-anniversary notifications.

## Recommended MVP Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- ORM/query layer: Prisma or Drizzle
- Graph/tree visualization: Cytoscape.js or React Flow
- Date handling: Luxon plus a Hijri calendar library with manual override support
- Packaging/deployment: Docker Compose for server deployment, plus local SQLite database file backup

## Core Principle

The family tree is a view of the data, not the data itself. The source of truth is a connected database of people, relationships, events, photos, places, and sources.

## Current Checkpoint

Current baseline:

```text
v0.1.0 - initial project documentation pack
v0.1.1 - governance and quality assurance system
v0.2.0 - runnable application scaffold
v0.3.0 - database foundation and migrations
v0.4.0 - SQLite-backed person registry
```

Before every release, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\project_audit.ps1
```

## Run The Scaffold

Install dependencies:

```powershell
npm install
```

Run API and web:

```powershell
npm run dev
```

Default local URLs:

```text
API health: http://localhost:3001/api/health
Web app:    http://localhost:5173
```

Run quality checks:

```powershell
npm run check
```

On this laptop, if global Node/npm is unavailable, first run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap_local_node.ps1
```

Then add the generated `.tools\node-...\` folder to the current PowerShell `Path` as shown by the script.

If PowerShell blocks `npm.ps1`, use `npm.cmd`:

```powershell
$nodeDir = Get-ChildItem .\.tools -Directory -Filter "node-*-win-x64" | Select-Object -First 1 -ExpandProperty FullName
$env:Path = "$nodeDir;$env:Path"
& "$nodeDir\npm.cmd" install
& "$nodeDir\npm.cmd" run check
```

Run database migrations:

```powershell
npm run db:migrate
```

Seed fake development data:

```powershell
npm run db:seed
```
