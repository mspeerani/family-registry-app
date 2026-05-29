import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { type AppConfig, getConfig, redactDatabaseUrl } from "./config.js";
import type { DatabaseHealth } from "./db/database.js";

export function createApp(
  config: AppConfig = getConfig(),
  databaseHealth?: DatabaseHealth
): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      app: "family-registry-api",
      database:
        databaseHealth ??
        {
          configured: Boolean(config.DATABASE_URL),
          migrationsApplied: 0,
          migrationsPending: 0,
          path: redactDatabaseUrl(config.DATABASE_URL),
          url: redactDatabaseUrl(config.DATABASE_URL)
        },
      environment: config.APP_ENV,
      locale: config.DEFAULT_LOCALE,
      status: "ok",
      uptimeSeconds: Math.round(process.uptime())
    });
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "not_found",
        message: "The requested API route does not exist."
      }
    });
  });

  return app;
}
