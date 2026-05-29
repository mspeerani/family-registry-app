import { DatabaseSync } from "node:sqlite";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { runMigrations } from "../src/db/database.js";

const config = {
  APP_ENV: "test" as const,
  APP_PORT: 3001,
  DATABASE_URL: "file::memory:",
  DEFAULT_LOCALE: "en" as const,
  SESSION_SECRET: undefined,
  UPLOAD_DIR: "./data/uploads"
};

describe("data transfer API", () => {
  let database: DatabaseSync;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    database = new DatabaseSync(":memory:");
    database.exec("PRAGMA foreign_keys = ON;");
    runMigrations(database);
    app = createApp(config, { database });
  });

  afterEach(() => {
    database.close();
  });

  it("exports people CSV and previews imports", async () => {
    await request(app).post("/api/people").send({ fullName: "Export Person" }).expect(201);

    const exportResponse = await request(app).get("/api/export/people.csv").expect(200);
    expect(exportResponse.text).toContain("fullName");
    expect(exportResponse.text).toContain("Export Person");

    const preview = await request(app)
      .post("/api/import/people/preview")
      .send({ csv: "fullName,fatherName\nImported Person,Imported Father\n" })
      .expect(200);

    expect(preview.body.validCount).toBe(1);
    expect(preview.body.invalidCount).toBe(0);
  });

  it("commits people import and creates/restores backups", async () => {
    await request(app)
      .post("/api/import/people/commit")
      .send({ csv: "fullName,fatherName\nImported Person,Imported Father\n" })
      .expect(200);

    const backup = await request(app).get("/api/export/backup").expect(200);
    expect(backup.body.tables.people).toHaveLength(1);

    await request(app).post("/api/restore/backup").send(backup.body).expect(200);

    const people = await request(app).get("/api/people").expect(200);
    expect(people.body.people).toHaveLength(1);
    expect(people.body.people[0].fullName).toBe("Imported Person");
  });
});

