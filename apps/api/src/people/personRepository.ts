import { randomUUID } from "node:crypto";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

import type { CreatePersonInput, UpdatePersonInput } from "./personSchemas.js";

export type Person = {
  biography: string | null;
  birthDateGregorian: string | null;
  birthDateGregorianPrecision: string;
  birthDateHijri: string | null;
  birthDateHijriPrecision: string;
  birthHijriSource: string;
  birthNote: string | null;
  birthPlace: string | null;
  burialPlace: string | null;
  createdAt: string;
  dataConfidence: string;
  deathDateGregorian: string | null;
  deathDateGregorianPrecision: string;
  deathDateHijri: string | null;
  deathDateHijriPrecision: string;
  deathHijriSource: string;
  deathNote: string | null;
  deathPlace: string | null;
  fatherName: string | null;
  fullName: string;
  gender: string;
  id: string;
  isArchived: boolean;
  nativeName: string | null;
  sourceNote: string | null;
  surname: string | null;
  updatedAt: string;
};

type PersonRow = {
  biography: string | null;
  birth_date_gregorian: string | null;
  birth_date_gregorian_precision: string;
  birth_date_hijri: string | null;
  birth_date_hijri_precision: string;
  birth_hijri_source: string;
  birth_note: string | null;
  birth_place_id: string | null;
  birth_place_name: string | null;
  burial_place_id: string | null;
  burial_place_name: string | null;
  created_at: string;
  data_confidence: string;
  death_date_gregorian: string | null;
  death_date_gregorian_precision: string;
  death_date_hijri: string | null;
  death_date_hijri_precision: string;
  death_hijri_source: string;
  death_note: string | null;
  death_place_id: string | null;
  death_place_name: string | null;
  father_name: string | null;
  full_name: string;
  gender: string;
  id: string;
  is_archived: number;
  native_name: string | null;
  source_note: string | null;
  surname: string | null;
  updated_at: string;
};

type ListPeopleOptions = {
  includeArchived?: boolean;
  query?: string;
};

const personSelect = `
  SELECT
    people.*,
    birth_place.name AS birth_place_name,
    death_place.name AS death_place_name,
    burial_place.name AS burial_place_name
  FROM people
  LEFT JOIN places AS birth_place ON birth_place.id = people.birth_place_id
  LEFT JOIN places AS death_place ON death_place.id = people.death_place_id
  LEFT JOIN places AS burial_place ON burial_place.id = people.burial_place_id
`;

function nowIso(): string {
  return new Date().toISOString();
}

function normalizePlaceName(name: string): string {
  return name.trim().toLowerCase();
}

function toPerson(row: PersonRow): Person {
  return {
    biography: row.biography,
    birthDateGregorian: row.birth_date_gregorian,
    birthDateGregorianPrecision: row.birth_date_gregorian_precision,
    birthDateHijri: row.birth_date_hijri,
    birthDateHijriPrecision: row.birth_date_hijri_precision,
    birthHijriSource: row.birth_hijri_source,
    birthNote: row.birth_note,
    birthPlace: row.birth_place_name,
    burialPlace: row.burial_place_name,
    createdAt: row.created_at,
    dataConfidence: row.data_confidence,
    deathDateGregorian: row.death_date_gregorian,
    deathDateGregorianPrecision: row.death_date_gregorian_precision,
    deathDateHijri: row.death_date_hijri,
    deathDateHijriPrecision: row.death_date_hijri_precision,
    deathHijriSource: row.death_hijri_source,
    deathNote: row.death_note,
    deathPlace: row.death_place_name,
    fatherName: row.father_name,
    fullName: row.full_name,
    gender: row.gender,
    id: row.id,
    isArchived: row.is_archived === 1,
    nativeName: row.native_name,
    sourceNote: row.source_note,
    surname: row.surname,
    updatedAt: row.updated_at
  };
}

function getPersonRowById(
  database: DatabaseSync,
  id: string,
  includeArchived = false
): PersonRow | null {
  const row = database
    .prepare(
      `
        ${personSelect}
        WHERE people.id = ?
        ${includeArchived ? "" : "AND people.is_archived = 0"}
      `
    )
    .get(id) as PersonRow | undefined;

  return row ?? null;
}

function getOrCreatePlaceId(database: DatabaseSync, name: string | null | undefined): string | null {
  if (!name) {
    return null;
  }

  const normalized = normalizePlaceName(name);
  const existing = database
    .prepare("SELECT id FROM places WHERE normalized_name = ?")
    .get(normalized) as { id: string } | undefined;

  if (existing) {
    return existing.id;
  }

  const id = randomUUID();
  const timestamp = nowIso();

  database
    .prepare(
      `
        INSERT INTO places (id, name, normalized_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(id, name.trim(), normalized, timestamp, timestamp);

  return id;
}

function recordAudit(
  database: DatabaseSync,
  entityId: string,
  action: "create" | "update" | "archive",
  before: unknown,
  after: unknown
): void {
  database
    .prepare(
      `
        INSERT INTO audit_log (id, entity_type, entity_id, action, before_json, after_json, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      randomUUID(),
      "person",
      entityId,
      action,
      before ? JSON.stringify(before) : null,
      after ? JSON.stringify(after) : null,
      "system",
      nowIso()
    );
}

export function listPeople(database: DatabaseSync, options: ListPeopleOptions = {}): Person[] {
  const filters: string[] = [];
  const params: SQLInputValue[] = [];

  if (!options.includeArchived) {
    filters.push("people.is_archived = 0");
  }

  if (options.query?.trim()) {
    const query = `%${options.query.trim()}%`;
    filters.push(
      `(
        people.full_name LIKE ?
        OR people.father_name LIKE ?
        OR people.surname LIKE ?
        OR people.native_name LIKE ?
        OR birth_place.name LIKE ?
        OR death_place.name LIKE ?
        OR burial_place.name LIKE ?
      )`
    );
    params.push(query, query, query, query, query, query, query);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  const rows = database
    .prepare(`${personSelect} ${where} ORDER BY people.full_name COLLATE NOCASE`)
    .all(...params) as PersonRow[];

  return rows.map(toPerson);
}

export function getPerson(database: DatabaseSync, id: string, includeArchived = false): Person | null {
  const row = getPersonRowById(database, id, includeArchived);
  return row ? toPerson(row) : null;
}

export function createPerson(database: DatabaseSync, input: CreatePersonInput): Person {
  const id = randomUUID();
  const timestamp = nowIso();

  database.exec("BEGIN;");
  try {
    const birthPlaceId = getOrCreatePlaceId(database, input.birthPlace);
    const deathPlaceId = getOrCreatePlaceId(database, input.deathPlace);
    const burialPlaceId = getOrCreatePlaceId(database, input.burialPlace);

    database
      .prepare(
        `
          INSERT INTO people (
            id,
            full_name,
            father_name,
            surname,
            native_name,
            gender,
            birth_date_gregorian,
            birth_date_gregorian_precision,
            birth_date_hijri,
            birth_date_hijri_precision,
            birth_hijri_source,
            birth_place_id,
            birth_note,
            death_date_gregorian,
            death_date_gregorian_precision,
            death_date_hijri,
            death_date_hijri_precision,
            death_hijri_source,
            death_place_id,
            burial_place_id,
            death_note,
            biography,
            data_confidence,
            source_note,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        id,
        input.fullName,
        input.fatherName ?? null,
        input.surname ?? null,
        input.nativeName ?? null,
        input.gender ?? "unknown",
        input.birthDateGregorian ?? null,
        input.birthDateGregorianPrecision ?? "unknown",
        input.birthDateHijri ?? null,
        input.birthDateHijriPrecision ?? "unknown",
        input.birthHijriSource ?? "unknown",
        birthPlaceId,
        input.birthNote ?? null,
        input.deathDateGregorian ?? null,
        input.deathDateGregorianPrecision ?? "unknown",
        input.deathDateHijri ?? null,
        input.deathDateHijriPrecision ?? "unknown",
        input.deathHijriSource ?? "unknown",
        deathPlaceId,
        burialPlaceId,
        input.deathNote ?? null,
        input.biography ?? null,
        input.dataConfidence ?? "unknown",
        input.sourceNote ?? null,
        timestamp,
        timestamp
      );

    const created = getPerson(database, id, true);
    recordAudit(database, id, "create", null, created);
    database.exec("COMMIT;");

    if (!created) {
      throw new Error("Person creation failed.");
    }

    return created;
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}

export function updatePerson(
  database: DatabaseSync,
  id: string,
  input: UpdatePersonInput
): Person | null {
  const existingRow = getPersonRowById(database, id, true);

  if (!existingRow) {
    return null;
  }

  const before = toPerson(existingRow);
  const timestamp = nowIso();
  const hasOwn = (key: keyof UpdatePersonInput) => Object.prototype.hasOwnProperty.call(input, key);

  database.exec("BEGIN;");
  try {
    const birthPlaceId = hasOwn("birthPlace")
      ? getOrCreatePlaceId(database, input.birthPlace)
      : existingRow.birth_place_id;
    const deathPlaceId = hasOwn("deathPlace")
      ? getOrCreatePlaceId(database, input.deathPlace)
      : existingRow.death_place_id;
    const burialPlaceId = hasOwn("burialPlace")
      ? getOrCreatePlaceId(database, input.burialPlace)
      : existingRow.burial_place_id;

    database
      .prepare(
        `
          UPDATE people
          SET
            full_name = ?,
            father_name = ?,
            surname = ?,
            native_name = ?,
            gender = ?,
            birth_date_gregorian = ?,
            birth_date_gregorian_precision = ?,
            birth_date_hijri = ?,
            birth_date_hijri_precision = ?,
            birth_hijri_source = ?,
            birth_place_id = ?,
            birth_note = ?,
            death_date_gregorian = ?,
            death_date_gregorian_precision = ?,
            death_date_hijri = ?,
            death_date_hijri_precision = ?,
            death_hijri_source = ?,
            death_place_id = ?,
            burial_place_id = ?,
            death_note = ?,
            biography = ?,
            data_confidence = ?,
            source_note = ?,
            updated_at = ?
          WHERE id = ?
        `
      )
      .run(
        input.fullName ?? existingRow.full_name,
        hasOwn("fatherName") ? input.fatherName ?? null : existingRow.father_name,
        hasOwn("surname") ? input.surname ?? null : existingRow.surname,
        hasOwn("nativeName") ? input.nativeName ?? null : existingRow.native_name,
        input.gender ?? existingRow.gender,
        hasOwn("birthDateGregorian")
          ? input.birthDateGregorian ?? null
          : existingRow.birth_date_gregorian,
        input.birthDateGregorianPrecision ?? existingRow.birth_date_gregorian_precision,
        hasOwn("birthDateHijri") ? input.birthDateHijri ?? null : existingRow.birth_date_hijri,
        input.birthDateHijriPrecision ?? existingRow.birth_date_hijri_precision,
        input.birthHijriSource ?? existingRow.birth_hijri_source,
        birthPlaceId,
        hasOwn("birthNote") ? input.birthNote ?? null : existingRow.birth_note,
        hasOwn("deathDateGregorian")
          ? input.deathDateGregorian ?? null
          : existingRow.death_date_gregorian,
        input.deathDateGregorianPrecision ?? existingRow.death_date_gregorian_precision,
        hasOwn("deathDateHijri") ? input.deathDateHijri ?? null : existingRow.death_date_hijri,
        input.deathDateHijriPrecision ?? existingRow.death_date_hijri_precision,
        input.deathHijriSource ?? existingRow.death_hijri_source,
        deathPlaceId,
        burialPlaceId,
        hasOwn("deathNote") ? input.deathNote ?? null : existingRow.death_note,
        hasOwn("biography") ? input.biography ?? null : existingRow.biography,
        input.dataConfidence ?? existingRow.data_confidence,
        hasOwn("sourceNote") ? input.sourceNote ?? null : existingRow.source_note,
        timestamp,
        id
      );

    const updated = getPerson(database, id, true);
    recordAudit(database, id, "update", before, updated);
    database.exec("COMMIT;");

    return updated;
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}

export function archivePerson(database: DatabaseSync, id: string): boolean {
  const existing = getPerson(database, id, true);

  if (!existing || existing.isArchived) {
    return false;
  }

  const timestamp = nowIso();

  database.exec("BEGIN;");
  try {
    database
      .prepare("UPDATE people SET is_archived = 1, updated_at = ? WHERE id = ?")
      .run(timestamp, id);
    const archived = getPerson(database, id, true);
    recordAudit(database, id, "archive", existing, archived);
    database.exec("COMMIT;");
    return true;
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}
