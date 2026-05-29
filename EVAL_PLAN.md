# Evaluation Plan

## Purpose

This plan defines how the app will be evaluated for correctness, performance, privacy, multilingual behavior, and production readiness.

## Evaluation Levels

### Level 1 - Repository Safety

Runs every commit:

- Audit ignored private file patterns.
- Check staged files.
- Check for suspicious private-data filenames.
- Check for `.env` files, databases, exports, backups, and photos.

### Level 2 - Unit And API Correctness

Begins when app code exists:

- Person validation tests.
- Relationship validation tests.
- Date precision tests.
- Reminder window tests.
- Search query tests.
- Import preview validation tests.

### Level 3 - UI Smoke Tests

Begins when frontend exists:

- App loads.
- Add person workflow works.
- Edit person workflow works.
- Language switch works.
- Urdu RTL layout renders.
- Search returns expected fake seed records.

### Level 4 - Data Integrity Tests

Begins when database exists:

- Migration from empty database.
- Fake seed data insert.
- Relationship consistency checks.
- Duplicate relationship prevention.
- Archive without permanent deletion.
- Backup and restore.

### Level 5 - Stress Tests

Begins after core features work:

- Run `npm run stress:api`.
- Seed 25,000 fake people in memory.
- Seed 100,000 fake relationships in memory.
- Search response target: under 500 ms for common queries on a modern laptop.
- Reminder generation target: under 1 second for 25,000 people.
- Graph view must stay usable by enforcing depth and node limits.

### Level 6 - Production Readiness

Required before `v1.0.0`:

- Production build passes.
- Docker Compose starts cleanly where Docker is installed; otherwise record a release exception.
- Backup/restore verified with automated isolated-database tests and local smoke checks.
- Public repo privacy audit passes.
- Accessibility smoke checks pass.
- Release notes complete.

Current `v1.0.0` evidence:

- `npm run check` passed.
- `npm run smoke:local` passed.
- `npm run stress:api` passed with 25,000 fake people and 100,000 fake relationships.
- Docker was not available on the local laptop for Compose verification.

## Fake Data Rule

Stress and sample data must use invented people only. Do not use real family names, real dates, real photos, real places tied to private records, or imported real data.
