# Implementation Plan

## Phase 0 - Project Setup

Deliverables:

- Git repository initialized.
- React + TypeScript frontend.
- Node.js + TypeScript backend.
- SQLite database configured.
- Migration system configured.
- Basic Docker Compose file.
- CI test command documented.

Done when:

- App starts locally.
- API health check works.
- Database migration runs.
- Empty UI shell loads.

## Phase 1 - Core Person Registry

Deliverables:

- People table.
- Add/edit person form.
- Person profile screen.
- Backend CRUD APIs.
- Basic validation.
- Audit log for create/update/archive.

Done when:

- User can create, edit, view, and archive a person.
- Missing optional data is accepted.
- Full name is required.
- Father's name is supported and visible in all key views.

## Phase 2 - Relationships

Deliverables:

- Relationship table.
- Relationship editor.
- Parents, spouse, children sections on profile.
- Derived grandchildren.

Done when:

- User can link father, mother, spouse, and children.
- Profile shows direct family.
- Grandchildren are derived from child links.
- Self-relationships and duplicate relationship links are blocked.

## Phase 3 - Search and Filters

Deliverables:

- Global search.
- Advanced filters.
- Missing-data filters.
- Search indexes.

Done when:

- User can search by all major fields.
- Advanced filters return correct results.
- Search remains fast on seed dataset.

## Phase 4 - Dates and Reminders

Deliverables:

- Gregorian and Hijri date fields.
- Precision handling.
- Manual/auto Hijri source.
- Next 7 days reminders.
- Past 5 / next 5 bottom summary.

Done when:

- Birth and death reminders work.
- Records with year-only dates do not appear in day reminders.
- Summary panel shows correct date window.

## Phase 5 - Tree and Graph Views

Deliverables:

- Family tree screen.
- Knowledge graph screen.
- Graph depth controls.
- Click node to open profile.
- Export tree as image or PDF.

Done when:

- Selected person tree renders parents, spouses, children, grandchildren.
- Knowledge graph renders selected person and relatives up to selected depth.
- Large graphs can be limited by depth.

## Phase 6 - Multilingual UI

Deliverables:

- Translation framework.
- English translation file.
- Urdu translation file.
- Gujarati translation file.
- RTL layout for Urdu.
- Language setting persistence.

Done when:

- User can switch languages without page reload if practical.
- UI labels update.
- Urdu layout uses RTL.
- Person data remains unchanged.

## Phase 7 - Import, Export, Backup

Deliverables:

- CSV export.
- CSV import preview and commit.
- Database backup.
- Database restore.
- Photo backup strategy.

Done when:

- User can export people and relationships.
- User can preview import errors before commit.
- Backup can be restored in a clean deployment.

## Phase 8 - Production Hardening

Deliverables:

- Authentication if deployed beyond localhost.
- Error logging.
- Automated tests.
- Playwright smoke tests.
- Docker Compose production docs.
- Seed data.
- Accessibility pass.

Done when:

- Production build runs with Docker Compose.
- Tests pass.
- Core workflows are documented.
- No critical accessibility or layout issues in supported languages.

