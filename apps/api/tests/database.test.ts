import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";

import { getMigrationState, resolveDatabasePath, runMigrations } from "../src/db/database.js";
import { sampleIds, seedFakeData } from "../src/db/seed.js";

describe("database foundation", () => {
  it("resolves file database URLs safely", () => {
    expect(resolveDatabasePath("file::memory:")).toBe(":memory:");
    expect(resolveDatabasePath("file:./data/family_registry.sqlite")).toContain(
      "family_registry.sqlite"
    );
  });

  it("applies core migrations and creates required tables", () => {
    const database = new DatabaseSync(":memory:");
    try {
      const state = runMigrations(database);
      const tables = database
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
        .all()
        .map((row) => (row as { name: string }).name);

      expect(state.pending).toEqual([]);
      expect(tables).toContain("people");
      expect(tables).toContain("relationships");
      expect(tables).toContain("places");
      expect(tables).toContain("schema_migrations");
    } finally {
      database.close();
    }
  });

  it("seeds fake development data only", () => {
    const database = new DatabaseSync(":memory:");
    try {
      runMigrations(database);
      seedFakeData(database);

      const count = database.prepare("SELECT COUNT(*) AS count FROM people").get() as {
        count: number;
      };
      const ahmed = database
        .prepare("SELECT full_name, father_name FROM people WHERE id = ?")
        .get(sampleIds.ahmed) as { father_name: string; full_name: string };
      const state = getMigrationState(database);

      expect(count.count).toBe(3);
      expect(ahmed).toEqual({
        father_name: "Hassan Yusuf",
        full_name: "Ahmed Hassan"
      });
      expect(state.pending).toEqual([]);
    } finally {
      database.close();
    }
  });

  it("rejects self-relationships", () => {
    const database = new DatabaseSync(":memory:");
    try {
      runMigrations(database);
      seedFakeData(database);

      expect(() => {
        database
          .prepare(
            `
              INSERT INTO relationships (
                id,
                person_id,
                related_person_id,
                relationship_type,
                created_at,
                updated_at
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `
          )
          .run(
            "00000000-0000-4000-8000-000000000999",
            sampleIds.ahmed,
            sampleIds.ahmed,
            "father",
            new Date().toISOString(),
            new Date().toISOString()
          );
      }).toThrow();
    } finally {
      database.close();
    }
  });
});

