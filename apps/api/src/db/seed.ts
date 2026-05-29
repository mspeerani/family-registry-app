import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

export const sampleIds = {
  ahmed: "00000000-0000-4000-8000-000000000101",
  fatima: "00000000-0000-4000-8000-000000000102",
  hassan: "00000000-0000-4000-8000-000000000103",
  sampleCity: "00000000-0000-4000-8000-000000000201",
  source: "00000000-0000-4000-8000-000000000301"
};

export function seedFakeData(database: DatabaseSync): void {
  const now = new Date().toISOString();

  database.exec("BEGIN;");
  try {
    database
      .prepare(
        `
          INSERT OR IGNORE INTO places (id, name, normalized_name, country, region, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        sampleIds.sampleCity,
        "Sample City",
        "sample city",
        "Example Country",
        "Demo Region",
        "Fake seed place for development only.",
        now,
        now
      );

    database
      .prepare(
        `
          INSERT OR IGNORE INTO sources (id, title, source_type, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        sampleIds.source,
        "Fake development source",
        "other",
        "Invented source used only for scaffold testing.",
        now,
        now
      );

    const insertPerson = database.prepare(`
      INSERT OR IGNORE INTO people (
        id,
        full_name,
        father_name,
        surname,
        native_name,
        gender,
        birth_date_gregorian,
        birth_date_gregorian_precision,
        birth_place_id,
        biography,
        data_confidence,
        source_note,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPerson.run(
      sampleIds.hassan,
      "Hassan Yusuf",
      "Yusuf Demo",
      "Demo",
      null,
      "male",
      "1931",
      "approximate",
      sampleIds.sampleCity,
      "Fake ancestor record for development seed data.",
      "approximate",
      "Fake seed source",
      now,
      now
    );

    insertPerson.run(
      sampleIds.ahmed,
      "Ahmed Hassan",
      "Hassan Yusuf",
      "Demo",
      null,
      "male",
      "1952-04-16",
      "exact",
      sampleIds.sampleCity,
      "Fake registry record for development seed data.",
      "confirmed",
      "Fake seed source",
      now,
      now
    );

    insertPerson.run(
      sampleIds.fatima,
      "Fatima Ibrahim",
      "Ibrahim Example",
      "Example",
      null,
      "female",
      "1958-09-03",
      "exact",
      sampleIds.sampleCity,
      "Fake spouse record for development seed data.",
      "likely",
      "Fake seed source",
      now,
      now
    );

    const insertRelationship = database.prepare(`
      INSERT OR IGNORE INTO relationships (
        id,
        person_id,
        related_person_id,
        relationship_type,
        confidence,
        notes,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRelationship.run(
      randomUUID(),
      sampleIds.ahmed,
      sampleIds.hassan,
      "father",
      "confirmed",
      "Fake father link for development only.",
      now,
      now
    );

    insertRelationship.run(
      randomUUID(),
      sampleIds.ahmed,
      sampleIds.fatima,
      "spouse",
      "confirmed",
      "Fake spouse link for development only.",
      now,
      now
    );

    database.exec("COMMIT;");
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}

