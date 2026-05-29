# Release Notes Draft

## Current Candidate

Current milestone:

```text
v0.9.0 - import/export/backup and hardening notes
```

## Included So Far

- Project governance and quality gates.
- Public repository privacy guardrails.
- React/Vite web app.
- Express/TypeScript API.
- SQLite migration foundation using `node:sqlite`.
- Person registry with create, edit, search, archive.
- Relationships and derived family profile data.
- Search filters and birth/death reminder windows.
- English, Urdu, and Gujarati UI with persisted locale.
- Family tree and SVG knowledge graph views.
- People CSV export.
- Relationships CSV export.
- People CSV import preview and commit.
- JSON backup export and restore.

## Production Exceptions Before v1.0.0

- Docker Compose is documented but not verified on this laptop because Docker is not installed.
- Authentication is not implemented yet.
- Restore endpoint is destructive and should be protected before real deployment.
- Relationship CSV import is not implemented yet.
- Real family data must not be entered until deployment privacy controls are reviewed.

## Verification Command

```powershell
npm run check
```

Current gate includes:

- API typecheck
- Web typecheck
- API tests
- Web tests
- Production builds
- Strict project privacy audit

