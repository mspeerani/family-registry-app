# Release Notes - v1.0.0

## Release

```text
v1.0.0 - production-ready release
```

## Included

- React/Vite web app with English, Urdu, and Gujarati UI.
- Express/TypeScript API with SQLite `node:sqlite` persistence.
- Person registry, archive behavior, search, reminders, relationships, family tree, and knowledge graph.
- People CSV import preview/commit, people CSV export, relationships CSV export, and JSON backup export/restore.
- Production login protection using an HTTP-only session cookie.
- Required production `APP_ADMIN_PASSWORD` and `SESSION_SECRET`.
- Restore confirmation phrase for destructive backup restore.
- Release smoke and stress scripts.

## Verification

Passed on 2026-05-29:

- `npm run check`
- `npm run smoke:local`
- `npm run stress:api`
- `npm audit --audit-level=high`

Stress evidence:

```text
Seeded 25000 fake people and 100000 fake relationships.
Search common query: 27.1 ms
Reminder window: 154.7 ms
Graph depth 3: 82.4 ms
```

## Known Limitations

- Docker Compose could not be verified on this laptop because Docker is not installed.
- Relationship CSV import is not included in this release.
- Hijri conversion and Hijri reminder logic are not complete.
- Photo upload/storage is modeled but not implemented in the UI.
- Real family data should only be entered after `.env` secrets and private deployment storage are configured.
