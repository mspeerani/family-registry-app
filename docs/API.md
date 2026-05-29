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

