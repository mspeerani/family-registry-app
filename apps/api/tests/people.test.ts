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

describe("people API", () => {
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

  it("creates a person with missing optional data", async () => {
    const response = await request(app)
      .post("/api/people")
      .send({ fullName: "Sample Person" })
      .expect(201);

    expect(response.body.person).toMatchObject({
      fatherName: null,
      fullName: "Sample Person",
      isArchived: false
    });
  });

  it("lists, updates, and archives a person", async () => {
    const created = await request(app)
      .post("/api/people")
      .send({
        birthPlace: "Sample City",
        fatherName: "Sample Father",
        fullName: "Sample Child",
        surname: "Example"
      })
      .expect(201);

    const id = created.body.person.id as string;

    await request(app)
      .patch(`/api/people/${id}`)
      .send({ biography: "Short fake biography.", dataConfidence: "confirmed" })
      .expect(200);

    const list = await request(app).get("/api/people?q=Sample").expect(200);
    expect(list.body.people).toHaveLength(1);
    expect(list.body.people[0]).toMatchObject({
      birthPlace: "Sample City",
      dataConfidence: "confirmed",
      fullName: "Sample Child"
    });

    await request(app).delete(`/api/people/${id}`).expect(200);

    const afterArchive = await request(app).get("/api/people").expect(200);
    expect(afterArchive.body.people).toEqual([]);
  });

  it("rejects an empty full name", async () => {
    const response = await request(app).post("/api/people").send({ fullName: " " }).expect(400);

    expect(response.body.error.code).toBe("validation_error");
  });
});
