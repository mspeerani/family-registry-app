import { DatabaseSync } from "node:sqlite";

import { createPerson, listPeople } from "../people/personRepository.js";
import { createPersonSchema, type CreatePersonInput } from "../people/personSchemas.js";
import { listRelationships } from "../relationships/relationshipRepository.js";
import { parseCsv, toCsv } from "./csv.js";

export type ImportPreviewRow = {
  data: Partial<CreatePersonInput>;
  errors: string[];
  rowNumber: number;
  warnings: string[];
};

export type ImportPreview = {
  invalidCount: number;
  rows: ImportPreviewRow[];
  validCount: number;
};

export type BackupData = {
  exportedAt: string;
  tables: {
    people: Record<string, unknown>[];
    places: Record<string, unknown>[];
    relationships: Record<string, unknown>[];
  };
  version: 1;
};

const peopleCsvHeaders = [
  "fullName",
  "fatherName",
  "surname",
  "birthDateGregorian",
  "birthPlace",
  "deathDateGregorian",
  "deathPlace",
  "dataConfidence",
  "biography"
];

const relationshipCsvHeaders = [
  "personId",
  "personName",
  "relatedPersonId",
  "relatedPersonName",
  "relationshipType",
  "confidence",
  "notes"
];

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function csvRowToPerson(row: Record<string, string>): Partial<CreatePersonInput> {
  return {
    biography: emptyToNull(row.biography),
    birthDateGregorian: emptyToNull(row.birthDateGregorian),
    birthDateGregorianPrecision: emptyToNull(row.birthDateGregorian) ? "exact" : "unknown",
    birthPlace: emptyToNull(row.birthPlace),
    dataConfidence:
      row.dataConfidence === "confirmed" ||
      row.dataConfidence === "likely" ||
      row.dataConfidence === "approximate" ||
      row.dataConfidence === "unknown"
        ? row.dataConfidence
        : "unknown",
    deathDateGregorian: emptyToNull(row.deathDateGregorian),
    deathDateGregorianPrecision: emptyToNull(row.deathDateGregorian) ? "exact" : "unknown",
    deathPlace: emptyToNull(row.deathPlace),
    fatherName: emptyToNull(row.fatherName),
    fullName: row.fullName?.trim() ?? "",
    surname: emptyToNull(row.surname)
  };
}

export function exportPeopleCsv(database: DatabaseSync): string {
  const rows = listPeople(database, { includeArchived: false }).map((person) => ({
    biography: person.biography,
    birthDateGregorian: person.birthDateGregorian,
    birthPlace: person.birthPlace,
    dataConfidence: person.dataConfidence,
    deathDateGregorian: person.deathDateGregorian,
    deathPlace: person.deathPlace,
    fatherName: person.fatherName,
    fullName: person.fullName,
    surname: person.surname
  }));

  return toCsv(peopleCsvHeaders, rows);
}

export function exportRelationshipsCsv(database: DatabaseSync): string {
  const rows = listRelationships(database).map((relationship) => ({
    confidence: relationship.confidence,
    notes: relationship.notes,
    personId: relationship.personId,
    personName: relationship.person.fullName,
    relatedPersonId: relationship.relatedPersonId,
    relatedPersonName: relationship.relatedPerson.fullName,
    relationshipType: relationship.relationshipType
  }));

  return toCsv(relationshipCsvHeaders, rows);
}

export function previewPeopleImport(database: DatabaseSync, csv: string): ImportPreview {
  const existing = listPeople(database, { includeArchived: true });
  const rows = parseCsv(csv).map((row, index): ImportPreviewRow => {
    const data = csvRowToPerson(row);
    const result = createPersonSchema.safeParse(data);
    const errors = result.success ? [] : result.error.issues.map((issue) => issue.message);
    const warnings: string[] = [];

    if (
      existing.some(
        (person) =>
          person.fullName.toLowerCase() === String(data.fullName ?? "").toLowerCase() &&
          (person.fatherName ?? "").toLowerCase() === (data.fatherName ?? "").toLowerCase()
      )
    ) {
      warnings.push("Possible duplicate based on full name and father's name.");
    }

    return {
      data,
      errors,
      rowNumber: index + 2,
      warnings
    };
  });

  return {
    invalidCount: rows.filter((row) => row.errors.length > 0).length,
    rows,
    validCount: rows.filter((row) => row.errors.length === 0).length
  };
}

export function commitPeopleImport(database: DatabaseSync, csv: string): { createdCount: number } {
  const preview = previewPeopleImport(database, csv);

  if (preview.invalidCount > 0) {
    throw new Error("Import contains invalid rows.");
  }

  let createdCount = 0;

  for (const row of preview.rows) {
    createPerson(database, createPersonSchema.parse(row.data));
    createdCount += 1;
  }

  return { createdCount };
}

export function createBackup(database: DatabaseSync): BackupData {
  return {
    exportedAt: new Date().toISOString(),
    tables: {
      people: database.prepare("SELECT * FROM people").all() as Record<string, unknown>[],
      places: database.prepare("SELECT * FROM places").all() as Record<string, unknown>[],
      relationships: database.prepare("SELECT * FROM relationships").all() as Record<string, unknown>[]
    },
    version: 1
  };
}

function insertRows(
  database: DatabaseSync,
  table: "people" | "places" | "relationships",
  rows: Record<string, unknown>[]
) {
  if (rows.length === 0) {
    return;
  }

  const first = rows[0];

  if (!first) {
    return;
  }

  const columns = Object.keys(first);
  const placeholders = columns.map(() => "?").join(", ");
  const statement = database.prepare(
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`
  );

  for (const row of rows) {
    statement.run(...columns.map((column) => row[column] as string | number | null));
  }
}

export function restoreBackup(database: DatabaseSync, backup: BackupData): void {
  if (backup.version !== 1) {
    throw new Error("Unsupported backup version.");
  }

  database.exec("BEGIN;");
  try {
    database.exec("DELETE FROM relationships;");
    database.exec("DELETE FROM people;");
    database.exec("DELETE FROM places;");

    insertRows(database, "places", backup.tables.places);
    insertRows(database, "people", backup.tables.people);
    insertRows(database, "relationships", backup.tables.relationships);

    database.exec("COMMIT;");
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}
