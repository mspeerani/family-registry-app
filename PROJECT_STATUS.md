# Project Status

## Current Phase

Phase: 5 - Search And Reminders

Current release target:

```text
v0.6.0 - search filters and reminders
```

Previous release:

```text
v0.5.0 - relationships and derived family links
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

## Immediate Next Phase

After `v0.6.0`, the next target is:

```text
v0.7.0 - multilingual UI hardening
```

Expected `v0.7.0` contents:

- Persisted language preference
- Urdu RTL smoke verification
- Gujarati layout smoke verification
- Translation coverage check
- Multilingual UI cleanup
