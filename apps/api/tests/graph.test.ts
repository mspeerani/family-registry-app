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

describe("family graph API", () => {
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

  it("returns graph nodes and edges up to selected depth", async () => {
    const root = await createPerson("Graph Root");
    const child = await createPerson("Graph Child");
    const grandchild = await createPerson("Graph Grandchild");

    await request(app)
      .post("/api/relationships")
      .send({ personId: child.id, relatedPersonId: root.id, relationshipType: "father" })
      .expect(201);
    await request(app)
      .post("/api/relationships")
      .send({ personId: grandchild.id, relatedPersonId: child.id, relationshipType: "father" })
      .expect(201);

    const depthOne = await request(app).get(`/api/people/${root.id}/graph?depth=1`).expect(200);
    expect(depthOne.body.graph.nodes).toHaveLength(2);
    expect(depthOne.body.graph.edges).toHaveLength(1);

    const depthTwo = await request(app).get(`/api/people/${root.id}/graph?depth=2`).expect(200);
    expect(depthTwo.body.graph.nodes).toHaveLength(3);
    expect(depthTwo.body.graph.edges).toHaveLength(2);
  });
});

