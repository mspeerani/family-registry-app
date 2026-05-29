# Data Model

## 1. Data Principles

1. Every person has an internal unique ID.
2. Full name plus father's name is a useful human identifier but not a database primary key.
3. Missing, approximate, and uncertain data must be supported.
4. Relationships should be stored as links between people.
5. Children, grandchildren, ancestors, and descendants should be derived from relationship links.
6. Gregorian and Hijri dates should be stored with precision and source metadata.

## 2. Core Tables

The following schema is conceptual. The developer may implement with Prisma, Drizzle, or SQL migrations, but must preserve the same data capability.

## 3. `people`

```sql
CREATE TABLE people (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  father_name TEXT,
  surname TEXT,
  native_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'unknown')) DEFAULT 'unknown',

  birth_date_gregorian TEXT,
  birth_date_gregorian_precision TEXT CHECK (birth_date_gregorian_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')) DEFAULT 'unknown',
  birth_date_hijri TEXT,
  birth_date_hijri_precision TEXT CHECK (birth_date_hijri_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')) DEFAULT 'unknown',
  birth_hijri_source TEXT CHECK (birth_hijri_source IN ('manual', 'auto', 'unknown')) DEFAULT 'unknown',
  birth_place_id TEXT,
  birth_note TEXT,

  death_date_gregorian TEXT,
  death_date_gregorian_precision TEXT CHECK (death_date_gregorian_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')) DEFAULT 'unknown',
  death_date_hijri TEXT,
  death_date_hijri_precision TEXT CHECK (death_date_hijri_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')) DEFAULT 'unknown',
  death_hijri_source TEXT CHECK (death_hijri_source IN ('manual', 'auto', 'unknown')) DEFAULT 'unknown',
  death_place_id TEXT,
  burial_place_id TEXT,
  death_note TEXT,

  biography TEXT,
  data_confidence TEXT CHECK (data_confidence IN ('confirmed', 'likely', 'approximate', 'unknown')) DEFAULT 'unknown',
  source_note TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 4. `relationships`

```sql
CREATE TABLE relationships (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  related_person_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL CHECK (
    relationship_type IN (
      'father',
      'mother',
      'spouse',
      'child',
      'sibling',
      'guardian',
      'adoptive_parent',
      'adoptive_child',
      'other'
    )
  ),
  start_date_gregorian TEXT,
  end_date_gregorian TEXT,
  confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible', 'unknown')) DEFAULT 'unknown',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (person_id) REFERENCES people(id),
  FOREIGN KEY (related_person_id) REFERENCES people(id),
  CHECK (person_id <> related_person_id)
);
```

Implementation note: The app may store only one directional relationship and derive inverse links in queries. For example, if A has relationship `father` to B, then B can show A as child depending on the chosen convention. The convention must be documented in code.

Recommended convention:

- `person_id` is the subject.
- `related_person_id` is the object.
- `relationship_type` describes how the related person is related to the subject.

Example:

- Omar's father is Ahmed: `person_id=Omar`, `related_person_id=Ahmed`, `relationship_type=father`.
- Omar's spouse is Fatima: `person_id=Omar`, `related_person_id=Fatima`, `relationship_type=spouse`.

## 5. `places`

```sql
CREATE TABLE places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT,
  country TEXT,
  region TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 6. `photos`

```sql
CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  original_filename TEXT,
  caption TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (person_id) REFERENCES people(id)
);
```

## 7. `sources`

```sql
CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('person', 'document', 'photo', 'memory', 'official_record', 'other')) DEFAULT 'other',
  description TEXT,
  contact_info TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 8. `person_sources`

```sql
CREATE TABLE person_sources (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  field_name TEXT,
  notes TEXT,
  FOREIGN KEY (person_id) REFERENCES people(id),
  FOREIGN KEY (source_id) REFERENCES sources(id)
);
```

## 9. `audit_log`

```sql
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'archive', 'restore', 'import')),
  before_json TEXT,
  after_json TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL
);
```

## 10. `settings`

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 11. Required Indexes

```sql
CREATE INDEX idx_people_full_name ON people(full_name);
CREATE INDEX idx_people_father_name ON people(father_name);
CREATE INDEX idx_people_surname ON people(surname);
CREATE INDEX idx_people_birth_gregorian ON people(birth_date_gregorian);
CREATE INDEX idx_people_death_gregorian ON people(death_date_gregorian);
CREATE INDEX idx_relationships_person ON relationships(person_id);
CREATE INDEX idx_relationships_related ON relationships(related_person_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);
CREATE INDEX idx_photos_person ON photos(person_id);
```

If SQLite FTS5 is available, create a search virtual table for people and places.

## 12. Date Storage Rules

Store dates as ISO-like strings:

- Exact Gregorian: `YYYY-MM-DD`
- Gregorian month precision: `YYYY-MM`
- Gregorian year precision: `YYYY`
- Exact Hijri: `YYYY-MM-DD`

Do not store fake days or months to compensate for unknown values.

## 13. Missing Data Rules

Missing data must be stored as null plus precision/status where relevant.

Examples:

- Unknown birth date: `birth_date_gregorian = null`, `birth_date_gregorian_precision = 'unknown'`
- Approximate birth year: `birth_date_gregorian = '1940'`, `birth_date_gregorian_precision = 'approximate'`

