# Development Guide

## Prerequisites

Preferred:

- Node.js 22 or newer
- npm 10 or newer

This repo does not require global database setup for the scaffold phase.

## Project-Local Node On This Laptop

This laptop currently uses a project-local portable Node runtime in `.tools/`, which is ignored by Git.

To recreate it:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap_local_node.ps1
```

To use it in the current PowerShell session:

```powershell
$nodeDir = Get-ChildItem .\.tools -Directory -Filter "node-*-win-x64" | Select-Object -First 1 -ExpandProperty FullName
$env:Path = "$nodeDir;$env:Path"
node --version
npm --version
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` directly:

```powershell
& "$nodeDir\npm.cmd" install
& "$nodeDir\npm.cmd" run check
```

## Install

```powershell
npm install
```

## Run Locally

Run API and web together:

```powershell
npm run dev
```

Run separately:

```powershell
npm run dev:api
npm run dev:web
```

Default URLs:

```text
API: http://localhost:3001/api/health
Web: http://localhost:5173
```

## Checks

```powershell
npm run check
```

The check command runs:

- TypeScript checks
- Tests
- Production builds
- Project privacy/safety audit

## Docker Compose

If Docker is installed:

```powershell
docker compose up --build
```

Docker is not required for local scaffold development.
