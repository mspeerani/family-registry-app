# Release Notes - v1.0.0

## Release

```text
v1.0.0 - production-ready release
```

## Included

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
- Production login protection using an HTTP-only session cookie.
- Production config validation for `APP_ADMIN_PASSWORD` and `SESSION_SECRET`.
- Explicit restore confirmation phrase for destructive backup restore.
- Local release smoke-test script.
- API stress-test harness using fake in-memory data.
- Graph traversal caps to keep large high-degree family graphs responsive.

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

- Docker Compose is documented but not verified on this laptop because Docker is not installed.
- Relationship CSV import is not included; relationship export is available.
- Hijri date conversion and Hijri reminder logic remain future work.
- Photo upload/storage is modeled but not implemented in the UI.
- Real family data should only be entered in a private deployment with `.env` secrets configured.
