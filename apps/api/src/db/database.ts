import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { DatabaseSync, type StatementSync } from "node:sqlite";

import { type AppConfig, getConfig, redactDatabaseUrl } from "../config.js";
import { migrations } from "./migrations.js";

export type DatabaseHandle = {
  database: DatabaseSync;
  path: string;
  close: () => void;
};

export type MigrationState = {
  applied: string[];
  pending: string[];
};

export type DatabaseHealth = {
  configured: boolean;
  migrationsApplied: number;
  migrationsPending: number;
  path: string;
  url: string;
};

type MigrationRow = {
  id: string;
};

export function resolveDatabasePath(databaseUrl: string, baseDir = process.cwd()): string {
  if (databaseUrl === ":memory:" || databaseUrl === "file::memory:") {
    return ":memory:";
  }

  if (!databaseUrl.startsWith("file:")) {
    throw new Error("Only file: SQLite database URLs are supported in this release.");
  }

  const rawPath = databaseUrl.slice("file:".length);

  if (!rawPath) {
    throw new Error("DATABASE_URL must include a SQLite file path.");
  }

  return isAbsolute(rawPath) ? rawPath : resolve(baseDir, rawPath);
}

export function openDatabase(config: AppConfig = getConfig()): DatabaseHandle {
  const databasePath = resolveDatabasePath(config.DATABASE_URL);

  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const database = new DatabaseSync(databasePath);
  database.exec("PRAGMA foreign_keys = ON;");

  return {
    close: () => database.close(),
    database,
    path: databasePath
  };
}

export function ensureMigrationTable(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}

export function getMigrationState(database: DatabaseSync): MigrationState {
  ensureMigrationTable(database);

  const rows = database
    .prepare("SELECT id FROM schema_migrations ORDER BY id")
    .all() as MigrationRow[];
  const applied = rows.map((row) => row.id);
  const pending = migrations
    .filter((migration) => !applied.includes(migration.id))
    .map((migration) => migration.id);

  return { applied, pending };
}

export function runMigrations(database: DatabaseSync): MigrationState {
  ensureMigrationTable(database);

  const appliedBefore = new Set(getMigrationState(database).applied);
  const insertMigration = database.prepare(
    "INSERT INTO schema_migrations (id, description, applied_at) VALUES (?, ?, ?)"
  ) as StatementSync;

  for (const migration of migrations) {
    if (appliedBefore.has(migration.id)) {
      continue;
    }

    database.exec("BEGIN;");
    try {
      database.exec(migration.sql);
      insertMigration.run(migration.id, migration.description, new Date().toISOString());
      database.exec("COMMIT;");
    } catch (error) {
      database.exec("ROLLBACK;");
      throw error;
    }
  }

  return getMigrationState(database);
}

export function getDatabaseHealth(config: AppConfig, state: MigrationState): DatabaseHealth {
  return {
    configured: Boolean(config.DATABASE_URL),
    migrationsApplied: state.applied.length,
    migrationsPending: state.pending.length,
    path: redactDatabaseUrl(config.DATABASE_URL),
    url: redactDatabaseUrl(config.DATABASE_URL)
  };
}

