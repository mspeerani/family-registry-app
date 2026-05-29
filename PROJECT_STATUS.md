# Project Status

## Current Phase

Phase: 4 - Relationships And Derived Family Links

Current release target:

```text
v0.5.0 - relationships and derived family links
```

Previous release:

```text
v0.4.0 - SQLite-backed person registry
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

After `v0.5.0`, the next target is:

```text
v0.6.0 - search and reminders
```

Expected `v0.6.0` contents:

- Advanced search filters
- Missing-data filters
- Birthday reminder window
- Death-anniversary reminder window
- Past 5 / next 5 summary backed by database
