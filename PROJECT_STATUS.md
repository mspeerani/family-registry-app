# Project Status

## Current Phase

Phase: 9 - Production Release

Current release target:

```text
v1.0.0 - production-ready release
```

Previous release:

```text
v0.9.0 - import/export/backup and hardening notes
```

## Scope Boundary

Authorized workspace:

```text
C:\Users\mspee\Documents\family tree with ui and database
```

Authorized GitHub repository:

```text
https://github.com/mspeerani/family-registry-app
```

Project operations must stay inside this workspace and repository. Do not modify, delete, reorganize, or publish files outside the project scope unless the user gives a separate explicit instruction.

## Public Repository Rule

This repository is public. Never commit real family data, real photos, private exports, backups, database files, credentials, API keys, or personal records.

Allowed public content:

- Source code
- Documentation
- Fake sample data
- Test fixtures using invented identities
- Configuration examples without secrets

Blocked public content:

- Real SQLite database files
- Real CSV/Excel family records
- Real photos
- `.env` files
- Backups
- Private notes
- Access tokens or keys

## Operating Model

The project is managed through a builder-reviewer-release loop:

1. Builder: implement the smallest complete phase.
2. Reviewer: check requirements, security, privacy, edge cases, and code quality.
3. Release manager: run checks, commit, tag where appropriate, and push.
4. Auditor: update status, risks, decisions, and checkpoint records.

No phase is complete until the relevant checkpoint gate passes.

## Release Status

Current `v1.0.0` release evidence:

- Production authentication added with HTTP-only session cookie.
- Production config requires admin password and strong session secret.
- Backup restore requires explicit confirmation phrase.
- Full automated check passed: typecheck, tests, builds, strict privacy audit.
- Local release smoke passed against running API and web app.
- API stress harness passed with 25,000 fake people and 100,000 fake relationships.
- npm audit found 0 high-or-higher vulnerabilities.

Documented exception:

- Docker Compose could not be verified on this laptop because Docker is not installed.
