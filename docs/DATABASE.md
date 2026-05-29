# Database Guide

## Current Status

The database foundation is introduced in `v0.3.0`.

The API uses Node.js built-in SQLite support through `node:sqlite`. This avoids native package installation during the foundation phase.

## Database Location

Default local database URL:

```text
file:./data/family_registry.sqlite
```

The `data/` folder is ignored by Git. Do not commit database files.

## Run Migrations

```powershell
npm run db:migrate
```

On this laptop, if PowerShell blocks `npm.ps1`, use the project-local `npm.cmd`:

```powershell
$nodeDir = Get-ChildItem .\.tools -Directory -Filter "node-*-win-x64" | Select-Object -First 1 -ExpandProperty FullName
$env:Path = "$nodeDir;$env:Path"
& "$nodeDir\npm.cmd" run db:migrate
```

## Seed Fake Data

```powershell
npm run db:seed
```

The seed command inserts invented records only. It must never use real family data.

## Core Tables

The first migration creates:

- `places`
- `people`
- `relationships`
- `photos`
- `sources`
- `person_sources`
- `audit_log`
- `settings`
- `schema_migrations`

## Migration Rule

Future schema changes must be additive migrations. Do not rewrite existing migrations after they have been tagged and pushed.

