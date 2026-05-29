# Checkpoints

## Version Map

```text
v0.1.0 - initial project documentation pack
v0.1.1 - governance and quality assurance system
v0.2.0 - runnable application scaffold
v0.3.0 - database foundation and migrations
v0.4.0 - person registry
v0.5.0 - relationships and derived family links
v0.6.0 - search and reminders
v0.7.0 - multilingual UI
v0.8.0 - family tree and knowledge graph
v0.9.0 - import/export/backup
v1.0.0 - production hardening and release
```

Version numbers may be adjusted if the implementation naturally splits differently, but the release notes must explain the change.

## Phase 0 - Governance And QA

Exit criteria:

- Governance documents exist.
- Public repo safety rules exist.
- Audit script exists and passes.
- `.gitignore` protects private data patterns.
- Commit pushed to GitHub.
- Tag `v0.1.1` created and pushed.

## Phase 1 - Runnable App Scaffold

Exit criteria:

- Frontend starts locally.
- Backend starts locally.
- Health check endpoint responds.
- `.env.example` exists.
- Docker Compose skeleton exists.
- README includes run instructions.
- Basic automated checks run.
- No private data committed.
- Tag `v0.2.0` created and pushed.

## Phase 2 - Database Foundation

Exit criteria:

- SQLite database connection works.
- Migration system works.
- Core tables exist.
- Fake seed data works.
- Database files are ignored by Git.
- Migration tests pass.
- Tag `v0.3.0` created and pushed.

## Phase 3 - Person Registry

Exit criteria:

- Add/edit/view/archive person works.
- Missing optional data is allowed.
- Person profile displays identity, birth, death, notes, confidence, and source fields.
- API validation exists.
- UI tests or smoke tests cover create/edit flow.
- Tag `v0.4.0` created and pushed.

## Phase 4 - Relationships

Exit criteria:

- Relationship editor exists.
- Father, mother, spouse, child, sibling, guardian, and other relationship types work.
- Self-relationships are blocked.
- Duplicate active links are blocked.
- Children and grandchildren are derived.
- Tag `v0.5.0` created and pushed.

## Phase 5 - Search And Reminders

Exit criteria:

- Basic search works.
- Advanced filters work.
- Missing-data filters work.
- Birthday reminders work.
- Death-anniversary reminders work.
- Past 5 / next 5 summary works.
- Tag `v0.6.0` created and pushed.

## Phase 6 - Multilingual UI

Exit criteria:

- English labels work.
- Urdu labels work with RTL layout.
- Gujarati labels work.
- Language preference persists.
- User-entered data is not translated or overwritten.
- Layout smoke tests pass.
- Tag `v0.7.0` created and pushed.

## Phase 7 - Tree And Graph

Exit criteria:

- Family tree renders selected person context.
- Knowledge graph renders selected person context.
- Depth controls work.
- Node click opens profile.
- Export image or PDF works.
- Tag `v0.8.0` created and pushed.

## Phase 8 - Import, Export, Backup, Hardening

Exit criteria:

- CSV import preview works.
- CSV export works.
- Backup works.
- Restore works in tests and requires explicit confirmation by `v1.0.0`.
- Production build works.
- Docker Compose deployment is documented.
- Security and privacy audit passes.
- Tag `v0.9.0` created and pushed.

## Phase 9 - Production Release

Exit criteria:

- All MVP acceptance criteria pass.
- Stress tests pass or documented limits are accepted.
- Backup/restore has been verified with automated tests and local smoke checks.
- Production authentication and restore confirmation are implemented.
- Public repo contains no private data.
- Release notes exist.
- Tag `v1.0.0` created and pushed.

Release evidence:

- `npm run check` passed.
- `npm run smoke:local` passed.
- `npm run stress:api` passed with 25,000 fake people and 100,000 fake relationships.
- `npm audit --audit-level=high` found 0 vulnerabilities.
- Docker Compose verification is pending on a machine with Docker installed.
