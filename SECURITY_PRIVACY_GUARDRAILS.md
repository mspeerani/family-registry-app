# Security And Privacy Guardrails

## Public Repository Boundary

The GitHub repository is public. Treat every committed file as permanently visible.

## Never Commit

- Real family databases
- Real family photos
- Real CSV, Excel, or PDF exports
- Backups
- `.env` files
- API keys
- Passwords
- Session secrets
- Private notes
- Personal identity documents
- Any real family data used for testing

## Allowed To Commit

- Source code
- Documentation
- Fake test data
- Fake seed records
- `.env.example`
- Empty placeholder files such as `.gitkeep`
- Database migration files

## Local Data Storage Rule

When the app exists, local private data should live in ignored folders such as:

```text
data/
uploads/
backups/
imports/
exports/
.tools/
```

These paths are ignored by `.gitignore`.

## Before Every Commit

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\project_audit.ps1
```

Then inspect:

```powershell
git status --short
git diff --cached --name-only
```

If any private or questionable file appears, unstage it before committing.

## Secrets Rule

Use `.env.example` for documented configuration names. Use `.env` locally for real values. Never commit `.env`.

Production deployments must set:

```text
APP_ADMIN_PASSWORD
SESSION_SECRET
```

`SESSION_SECRET` must be at least 32 characters. Do not reuse passwords or secrets from any other account.

## Photo Rule

Do not commit photos. UI fixtures may use generated placeholders or simple local SVG/PNG assets only if they contain no real people and no private family information.

## Project-Local Tooling Rule

Project-local downloaded tools may live in `.tools/`. This folder is ignored by Git and must not be published.
