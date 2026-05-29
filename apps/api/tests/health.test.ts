import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

describe("GET /api/health", () => {
  it("returns scaffold health status without exposing a local database path", async () => {
    const app = createApp(
      {
        APP_ENV: "test",
        APP_PORT: 3001,
        DATABASE_URL: "file:./data/family_registry.sqlite",
        DEFAULT_LOCALE: "en",
        SESSION_SECRET: undefined,
        UPLOAD_DIR: "./data/uploads"
      },
      {}
    );

    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toMatchObject({
      app: "family-registry-api",
      database: {
        configured: true,
        migrationsApplied: 0,
        migrationsPending: 0,
        path: "file:<local-sqlite-path>",
        url: "file:<local-sqlite-path>"
      },
      environment: "test",
      locale: "en",
      status: "ok"
    });
  });
});
