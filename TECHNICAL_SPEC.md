# Technical Specification

## 1. Recommended Architecture

Use a local-first web application with a thin UI and a small API server.

Recommended stack:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Query layer: repository modules using Node.js `node:sqlite`
- Graph visualization: native React/SVG with server-side traversal caps
- Styling: minimal CSS
- Testing: Vitest, backend API tests, project audit, local smoke script, API stress script
- Packaging: Docker Compose

Alternative acceptable stack:

- Python FastAPI backend
- React frontend
- SQLite database

The stack must stay simple and production deployable.

## 2. High-Level Components

### Frontend

Responsibilities:

- Render registry table, person profile, relationship editor, tree, graph, reminders, import/export screens.
- Manage UI language and text direction.
- Validate forms before API submission.
- Display duplicate warnings and missing-data indicators.

### Backend API

Responsibilities:

- Provide REST or tRPC endpoints.
- Validate all incoming data.
- Enforce relationship consistency rules.
- Run search queries.
- Generate reminder summaries.
- Manage import/export and backup/restore.

### Database

Responsibilities:

- Store people, relationships, events, places, photos, sources, audit log, and settings.
- Use migrations.
- Maintain indexes for search and date reminders.

## 3. Deployment Model

Production target:

- Single server or local machine
- Docker Compose
- SQLite database stored in mounted persistent volume
- Uploaded photos stored in mounted persistent volume

Required environment variables:

```env
APP_ENV=production
APP_PORT=3000
CORS_ORIGIN=https://your-family-registry-domain.example
DATABASE_URL=file:/data/family_registry.sqlite
UPLOAD_DIR=/data/uploads
APP_ADMIN_PASSWORD=change-this-password
SESSION_SECRET=change-this-secret-at-least-32-characters
DEFAULT_LOCALE=en
```

Production startup must fail if `APP_ADMIN_PASSWORD` or a strong `SESSION_SECRET` is missing.

## 4. API Endpoints

Endpoint names may vary, but the implementation must cover these capabilities.

### People

```http
GET /api/people
GET /api/people/:id
POST /api/people
PATCH /api/people/:id
DELETE /api/people/:id
GET /api/people/:id/profile
GET /api/people/:id/ancestors
GET /api/people/:id/descendants
GET /api/people/:id/tree
GET /api/people/:id/graph?depth=2
```

Large graph responses are capped and include a `truncated` flag when the server limits traversal.

### Auth

```http
GET /api/auth/status
POST /api/auth/login
POST /api/auth/logout
```

All data routes require login when `APP_ADMIN_PASSWORD` is configured.

### Relationships

```http
GET /api/relationships?personId=:id
POST /api/relationships
PATCH /api/relationships/:id
DELETE /api/relationships/:id
```

### Search

```http
GET /api/search?q=:query
POST /api/search/advanced
```

### Reminders

```http
GET /api/reminders/upcoming?days=7
GET /api/reminders/window?pastDays=5&futureDays=5
```

### Photos

```http
POST /api/people/:id/photos
GET /api/photos/:id
DELETE /api/photos/:id
```

### Import/Export

```http
POST /api/import/people/preview
POST /api/import/people/commit
GET /api/export/people.csv
GET /api/export/relationships.csv
GET /api/export/backup
POST /api/restore/backup
```

Restore requires the confirmation phrase `RESTORE_FAMILY_REGISTRY`.

### Settings

```http
GET /api/settings
PATCH /api/settings
```

## 5. Validation Rules

### Person

- `full_name` is required.
- `father_name` is recommended and should be requested, but records may be allowed with it missing if `missing_reason` is supplied.
- Date fields must validate according to their precision.
- Death date cannot be before birth date if both exact Gregorian dates are known.
- Native name may contain Urdu, Gujarati, Arabic, or other Unicode scripts.

### Relationship

- A person cannot be related to self.
- Duplicate active relationship records should be prevented.
- Spouse relationship should be mirrored or queried bidirectionally.
- Parent-child relationship should be internally consistent.
- A child can have zero, one, or more parent links because records may be incomplete or nontraditional.

## 6. Search Implementation

Use SQLite FTS5 where available.

Searchable content:

- Full name
- Father's name
- Surname
- Native name
- Place names
- Notes
- Source notes

Search must support:

- Case-insensitive English search
- Unicode text storage
- Prefix search where practical
- Field filters for advanced search

## 7. Reminder Logic

Generate reminders from birth and death events.

For each person:

- Birthday event if date of birth has at least month and day.
- Death anniversary event if date of death has at least month and day.
- Include Gregorian reminders as default.
- Include Hijri reminders if Hijri month/day exists and user enables Hijri reminders.

Records with only year known must not appear in day-based reminders.

## 8. Security

Minimum:

- Validate and sanitize all input.
- Use parameterized queries or ORM-safe queries.
- Store uploads outside source directory.
- Restrict upload file types to images.
- Enforce max upload size.
- Require authentication in production.
- Use secure session secret in production.
- Require explicit confirmation before destructive restore.

## 9. Accessibility

Required:

- Keyboard navigable forms and tables.
- Visible focus states.
- Proper labels for form fields.
- Sufficient contrast.
- RTL support for Urdu.
- Avoid text overlap at 320 px width and larger.

## 10. Testing

Minimum tests:

- Person create/edit/delete API tests.
- Relationship API tests.
- Search tests.
- Reminder window tests.
- Date precision tests.
- Import validation tests.
- UI language switch tests.
- Urdu RTL layout smoke test.
- Local smoke script for API, web, import preview, exports, and restore guard.
- API stress script for search, reminder, and graph performance.

## 11. Logging and Errors

The app must:

- Return structured API errors.
- Log backend errors with timestamp and request ID.
- Show user-friendly frontend errors.
- Avoid exposing stack traces in production.
