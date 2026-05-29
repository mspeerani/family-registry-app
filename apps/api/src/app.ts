import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { DatabaseSync } from "node:sqlite";

import { type AppConfig, getConfig, redactDatabaseUrl } from "./config.js";
import type { DatabaseHealth } from "./db/database.js";
import { createPeopleRouter } from "./people/personRoutes.js";
import { createRelationshipRouter } from "./relationships/relationshipRoutes.js";

export function createApp(
  config: AppConfig = getConfig(),
  services: { database?: DatabaseSync; databaseHealth?: DatabaseHealth } = {}
): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      app: "family-registry-api",
      database:
        services.databaseHealth ??
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

  if (services.database) {
    app.use("/api/people", createPeopleRouter(services.database));
    app.use("/api/relationships", createRelationshipRouter(services.database));
  }

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "not_found",
        message: "The requested API route does not exist."
      }
    });
  });

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
    console.error(error);
    response.status(500).json({
      error: {
        code: "internal_error",
        message:
          config.APP_ENV === "production"
            ? "An internal error occurred."
            : error instanceof Error
              ? error.message
              : "An internal error occurred."
      }
    });
    }
  );

  return app;
}
