# API Guide

## Base URL

Local default:

```text
http://localhost:3001
```

## Health

```http
GET /api/health
```

Returns API status, locale, redacted database path, and migration counts.

## People

### List People

```http
GET /api/people
GET /api/people?q=Ahmed
GET /api/people?includeArchived=true
```

Response:

```json
{
  "people": []
}
```

### Get Person

```http
GET /api/people/:id
```

### Create Person

```http
POST /api/people
Content-Type: application/json
```

Minimum body:

```json
{
  "fullName": "Sample Person"
}
```

Optional fields:

```json
{
  "fatherName": "Sample Father",
  "surname": "Sample",
  "birthDateGregorian": "1952-04-16",
  "birthPlace": "Sample City",
  "deathDateGregorian": null,
  "deathPlace": null,
  "biography": "Fake note.",
  "dataConfidence": "confirmed"
}
```

### Update Person

```http
PATCH /api/people/:id
Content-Type: application/json
```

Body may contain any editable person fields.

### Archive Person

```http
DELETE /api/people/:id
```

This archives the record. It does not physically delete the row.

## Validation

- `fullName` is required for create.
- Optional fields may be blank or null.
- Invalid person input returns `400 validation_error`.
- Missing person IDs return `404 not_found`.

## Relationships

Relationship convention:

```text
person_id -> relationship_type -> related_person_id
```

The relationship type describes how the related person is related to the subject person.

Example:

```json
{
  "personId": "child-id",
  "relatedPersonId": "father-id",
  "relationshipType": "father"
}
```

This means the selected person has the related person as father.

### List Relationships

```http
GET /api/relationships
GET /api/relationships?personId=:id
```

### Create Relationship

```http
POST /api/relationships
Content-Type: application/json
```

Body:

```json
{
  "personId": "person-id",
  "relatedPersonId": "related-person-id",
  "relationshipType": "father",
  "confidence": "confirmed",
  "notes": "Optional note"
}
```

Supported relationship types:

```text
father
mother
spouse
child
sibling
guardian
adoptive_parent
adoptive_child
other
```

### Delete Relationship

```http
DELETE /api/relationships/:id
```

### Person Family Profile

```http
GET /api/people/:id/profile
```

Returns:

```json
{
  "profile": {
    "person": {},
    "parents": [],
    "spouses": [],
    "children": [],
    "grandchildren": []
  }
}
```

## Relationship Validation

- Self-relationships return `400 self_relationship`.
- Duplicate relationship links return `409 duplicate_relationship`.
- Missing people return `404 person_missing`.

## Search

### Basic Search

```http
GET /api/search?q=Ahmed
```

### Advanced Search

```http
POST /api/search/advanced
Content-Type: application/json
```

Body:

```json
{
  "query": "Ahmed",
  "missingBirthDate": true,
  "missingFatherName": false,
  "bornInPlace": "Sample City"
}
```

## Reminders

Reminder windows currently use Gregorian dates with known month and day.

### Upcoming

```http
GET /api/reminders/upcoming?days=7
```

### Past/Future Window

```http
GET /api/reminders/window?pastDays=5&futureDays=5
```

For deterministic testing:

```http
GET /api/reminders/window?pastDays=5&futureDays=5&today=2026-05-29
```

Response:

```json
{
  "past": [],
  "future": []
}
```
