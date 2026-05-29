import { DatabaseSync } from "node:sqlite";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { runMigrations } from "../src/db/database.js";

const config = {
  APP_ADMIN_PASSWORD: undefined,
  APP_ENV: "test" as const,
  APP_PORT: 3001,
  CORS_ORIGIN: "http://localhost:5173",
  DATABASE_URL: "file::memory:",
  DEFAULT_LOCALE: "en" as const,
  SESSION_SECRET: undefined,
  UPLOAD_DIR: "./data/uploads"
};

describe("search and reminders API", () => {
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

  it("filters missing data with advanced search", async () => {
    await request(app).post("/api/people").send({ fullName: "Missing Birth" }).expect(201);
    await request(app)
      .post("/api/people")
      .send({
        birthDateGregorian: "1980-05-30",
        birthDateGregorianPrecision: "exact",
        fatherName: "Known Father",
        fullName: "Known Birth"
      })
      .expect(201);

    const response = await request(app)
      .post("/api/search/advanced")
      .send({ missingBirthDate: true, missingFatherName: true })
      .expect(200);

    expect(response.body.people).toHaveLength(1);
    expect(response.body.people[0].fullName).toBe("Missing Birth");
  });

  it("returns birth and death reminder windows for exact month/day dates", async () => {
    await request(app)
      .post("/api/people")
      .send({
        birthDateGregorian: "1980-05-30",
        birthDateGregorianPrecision: "exact",
        deathDateGregorian: "2020-05-27",
        deathDateGregorianPrecision: "exact",
        fatherName: "Reminder Father",
        fullName: "Reminder Person"
      })
      .expect(201);

    const response = await request(app)
      .get("/api/reminders/window?pastDays=5&futureDays=5&today=2026-05-29")
      .expect(200);

    expect(response.body.past).toHaveLength(1);
    expect(response.body.future).toHaveLength(1);
    expect(response.body.past[0].eventType).toBe("death");
    expect(response.body.future[0].eventType).toBe("birth");
  });
});
