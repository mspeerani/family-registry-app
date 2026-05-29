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

describe("relationship API", () => {
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

  async function createPerson(fullName: string) {
    const response = await request(app).post("/api/people").send({ fullName }).expect(201);
    return response.body.person as { id: string; fullName: string };
  }

  it("creates relationships and derives family profile links", async () => {
    const father = await createPerson("Sample Father");
    const child = await createPerson("Sample Child");
    const grandchild = await createPerson("Sample Grandchild");

    await request(app)
      .post("/api/relationships")
      .send({
        confidence: "confirmed",
        personId: child.id,
        relatedPersonId: father.id,
        relationshipType: "father"
      })
      .expect(201);

    await request(app)
      .post("/api/relationships")
      .send({
        confidence: "confirmed",
        personId: grandchild.id,
        relatedPersonId: child.id,
        relationshipType: "father"
      })
      .expect(201);

    const fatherProfile = await request(app).get(`/api/people/${father.id}/profile`).expect(200);
    expect(fatherProfile.body.profile.children).toHaveLength(1);
    expect(fatherProfile.body.profile.grandchildren).toHaveLength(1);
    expect(fatherProfile.body.profile.children[0].fullName).toBe("Sample Child");
  });

  it("rejects self-relationships and duplicate relationships", async () => {
    const person = await createPerson("Sample Person");
    const related = await createPerson("Sample Related");

    await request(app)
      .post("/api/relationships")
      .send({
        personId: person.id,
        relatedPersonId: person.id,
        relationshipType: "father"
      })
      .expect(400);

    const relationship = {
      personId: person.id,
      relatedPersonId: related.id,
      relationshipType: "spouse"
    };

    await request(app).post("/api/relationships").send(relationship).expect(201);
    await request(app).post("/api/relationships").send(relationship).expect(409);
  });
});

