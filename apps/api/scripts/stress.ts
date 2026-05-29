import { performance } from "node:perf_hooks";
import { DatabaseSync } from "node:sqlite";

import { migrations } from "../src/db/migrations.js";
import { listPeople } from "../src/people/personRepository.js";
import { getFamilyGraph } from "../src/relationships/relationshipRepository.js";
import { getReminderWindow } from "../src/reminders/reminderRepository.js";

const peopleCount = Number(process.env.STRESS_PEOPLE ?? 25_000);
const relationshipCount = Number(process.env.STRESS_RELATIONSHIPS ?? 100_000);

const targets = {
  graphMs: Number(process.env.STRESS_GRAPH_TARGET_MS ?? 1_000),
  reminderMs: Number(process.env.STRESS_REMINDER_TARGET_MS ?? 1_000),
  searchMs: Number(process.env.STRESS_SEARCH_TARGET_MS ?? 500)
};

function assertTarget(name: string, elapsedMs: number, targetMs: number): void {
  if (elapsedMs > targetMs) {
    throw new Error(`${name} took ${elapsedMs.toFixed(1)} ms, target is ${targetMs} ms.`);
  }
}

function measure<T>(label: string, callback: () => T): { elapsedMs: number; result: T } {
  const start = performance.now();
  const result = callback();
  const elapsedMs = performance.now() - start;
  console.log(`${label}: ${elapsedMs.toFixed(1)} ms`);
  return { elapsedMs, result };
}

const database = new DatabaseSync(":memory:");
database.exec("PRAGMA foreign_keys = ON;");
for (const migration of migrations) {
  database.exec(migration.sql);
}

const timestamp = new Date("2026-05-29T00:00:00.000Z").toISOString();
const insertPerson = database.prepare(`
  INSERT INTO people (
    id,
    full_name,
    father_name,
    surname,
    gender,
    birth_date_gregorian,
    birth_date_gregorian_precision,
    death_date_gregorian,
    death_date_gregorian_precision,
    data_confidence,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, 'unknown', ?, 'exact', ?, 'exact', 'confirmed', ?, ?)
`);

const insertRelationship = database.prepare(`
  INSERT OR IGNORE INTO relationships (
    id,
    person_id,
    related_person_id,
    relationship_type,
    confidence,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, 'confirmed', ?, ?)
`);

database.exec("BEGIN;");
try {
  for (let index = 0; index < peopleCount; index += 1) {
    const month = String((index % 12) + 1).padStart(2, "0");
    const day = String((index % 28) + 1).padStart(2, "0");
    insertPerson.run(
      `person-${index}`,
      `Stress Person ${index}`,
      `Stress Father ${Math.floor(index / 5)}`,
      `Stress Surname ${index % 250}`,
      `19${String(index % 100).padStart(2, "0")}-${month}-${day}`,
      index % 7 === 0 ? `20${String(index % 25).padStart(2, "0")}-${month}-${day}` : null,
      timestamp,
      timestamp
    );
  }

  const relationshipTypes = ["father", "mother", "spouse", "sibling"];
  for (let index = 0; index < relationshipCount; index += 1) {
    const personIndex = (index % Math.max(1, peopleCount - 1)) + 1;
    let relatedIndex = Math.floor(index / Math.max(1, peopleCount - 1)) % peopleCount;

    if (relatedIndex === personIndex) {
      relatedIndex = (relatedIndex + 1) % peopleCount;
    }

    insertRelationship.run(
      `relationship-${index}`,
      `person-${personIndex}`,
      `person-${relatedIndex}`,
      relationshipTypes[index % relationshipTypes.length],
      timestamp,
      timestamp
    );
  }

  database.exec("COMMIT;");
} catch (error) {
  database.exec("ROLLBACK;");
  throw error;
}

console.log(`Seeded ${peopleCount} fake people and ${relationshipCount} fake relationships.`);

const search = measure("Search common query", () => listPeople(database, { query: "Stress Person 249" }));
const reminders = measure("Reminder window", () =>
  getReminderWindow(database, {
    futureDays: 5,
    pastDays: 5,
    today: "2026-05-29"
  })
);
const graph = measure("Graph depth 3", () => getFamilyGraph(database, "person-1", 3));

assertTarget("Search common query", search.elapsedMs, targets.searchMs);
assertTarget("Reminder window", reminders.elapsedMs, targets.reminderMs);
assertTarget("Graph depth 3", graph.elapsedMs, targets.graphMs);

console.log(
  JSON.stringify(
    {
      graphEdges: graph.result?.edges.length ?? 0,
      graphNodes: graph.result?.nodes.length ?? 0,
      peopleCount,
      relationshipCount,
      reminderEvents: reminders.result.length,
      searchResults: search.result.length
    },
    null,
    2
  )
);

database.close();
