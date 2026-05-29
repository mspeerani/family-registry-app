import { DatabaseSync } from "node:sqlite";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { getConfig } from "../src/config.js";
import { runMigrations } from "../src/db/database.js";

const config = {
  APP_ADMIN_PASSWORD: "correct family password",
  APP_ENV: "test" as const,
  APP_PORT: 3001,
  CORS_ORIGIN: "http://localhost:5173",
  DATABASE_URL: "file::memory:",
  DEFAULT_LOCALE: "en" as const,
  SESSION_SECRET: "test-session-secret-with-at-least-32-chars",
  UPLOAD_DIR: "./data/uploads"
};

describe("authentication", () => {
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

  it("protects registry data when an admin password is configured", async () => {
    await request(app).get("/api/auth/status").expect(200, {
      authenticated: false,
      authRequired: true
    });

    await request(app).get("/api/people").expect(401);
  });

  it("sets an http-only session after login", async () => {
    const agent = request.agent(app);

    const login = await agent
      .post("/api/auth/login")
      .send({ password: "correct family password" })
      .expect(200);

    expect(String(login.headers["set-cookie"])).toContain("HttpOnly");
    await agent.get("/api/people").expect(200);
  });

  it("rejects an incorrect password", async () => {
    await request(app).post("/api/auth/login").send({ password: "wrong password" }).expect(401);
  });
});

describe("production configuration", () => {
  it("requires an admin password and strong session secret in production", () => {
    expect(() =>
      getConfig({
        APP_ENV: "production"
      })
    ).toThrow(/APP_ADMIN_PASSWORD/);

    const parsed = getConfig({
      APP_ADMIN_PASSWORD: "production-password",
      APP_ENV: "production",
      SESSION_SECRET: "production-session-secret-with-at-least-32-chars"
    });

    expect(parsed.APP_ENV).toBe("production");
  });
});
