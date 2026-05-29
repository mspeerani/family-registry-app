export type Migration = {
  id: string;
  description: string;
  sql: string;
};

export const migrations: Migration[] = [
  {
    id: "001_core_schema",
    description: "Create core family registry schema",
    sql: `
      CREATE TABLE IF NOT EXISTS places (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        normalized_name TEXT,
        country TEXT,
        region TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS people (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        father_name TEXT,
        surname TEXT,
        native_name TEXT,
        gender TEXT CHECK (gender IN ('male', 'female', 'other', 'unknown')) DEFAULT 'unknown',

        birth_date_gregorian TEXT,
        birth_date_gregorian_precision TEXT CHECK (
          birth_date_gregorian_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')
        ) DEFAULT 'unknown',
        birth_date_hijri TEXT,
        birth_date_hijri_precision TEXT CHECK (
          birth_date_hijri_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')
        ) DEFAULT 'unknown',
        birth_hijri_source TEXT CHECK (birth_hijri_source IN ('manual', 'auto', 'unknown')) DEFAULT 'unknown',
        birth_place_id TEXT,
        birth_note TEXT,

        death_date_gregorian TEXT,
        death_date_gregorian_precision TEXT CHECK (
          death_date_gregorian_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')
        ) DEFAULT 'unknown',
        death_date_hijri TEXT,
        death_date_hijri_precision TEXT CHECK (
          death_date_hijri_precision IN ('exact', 'month', 'year', 'approximate', 'unknown')
        ) DEFAULT 'unknown',
        death_hijri_source TEXT CHECK (death_hijri_source IN ('manual', 'auto', 'unknown')) DEFAULT 'unknown',
        death_place_id TEXT,
        burial_place_id TEXT,
        death_note TEXT,

        biography TEXT,
        data_confidence TEXT CHECK (
          data_confidence IN ('confirmed', 'likely', 'approximate', 'unknown')
        ) DEFAULT 'unknown',
        source_note TEXT,
        is_archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (birth_place_id) REFERENCES places(id),
        FOREIGN KEY (death_place_id) REFERENCES places(id),
        FOREIGN KEY (burial_place_id) REFERENCES places(id)
      );

      CREATE TABLE IF NOT EXISTS relationships (
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
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (related_person_id) REFERENCES people(id) ON DELETE CASCADE,
        CHECK (person_id <> related_person_id),
        UNIQUE (person_id, related_person_id, relationship_type)
      );

      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        person_id TEXT NOT NULL,
        file_path TEXT NOT NULL,
        original_filename TEXT,
        caption TEXT,
        is_primary INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        source_type TEXT CHECK (
          source_type IN ('person', 'document', 'photo', 'memory', 'official_record', 'other')
        ) DEFAULT 'other',
        description TEXT,
        contact_info TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS person_sources (
        id TEXT PRIMARY KEY,
        person_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        field_name TEXT,
        notes TEXT,
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'archive', 'restore', 'import')),
        before_json TEXT,
        after_json TEXT,
        created_by TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_people_full_name ON people(full_name);
      CREATE INDEX IF NOT EXISTS idx_people_father_name ON people(father_name);
      CREATE INDEX IF NOT EXISTS idx_people_surname ON people(surname);
      CREATE INDEX IF NOT EXISTS idx_people_birth_gregorian ON people(birth_date_gregorian);
      CREATE INDEX IF NOT EXISTS idx_people_death_gregorian ON people(death_date_gregorian);
      CREATE INDEX IF NOT EXISTS idx_relationships_person ON relationships(person_id);
      CREATE INDEX IF NOT EXISTS idx_relationships_related ON relationships(related_person_id);
      CREATE INDEX IF NOT EXISTS idx_relationships_type ON relationships(relationship_type);
      CREATE INDEX IF NOT EXISTS idx_photos_person ON photos(person_id);
    `
  }
];

