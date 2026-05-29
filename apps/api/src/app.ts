import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { DatabaseSync } from "node:sqlite";

import { createAuthController } from "./auth.js";
import { type AppConfig, getConfig, redactDatabaseUrl } from "./config.js";
import type { DatabaseHealth } from "./db/database.js";
import { createDataTransferRouter } from "./dataTransfer/dataTransferRoutes.js";
import { createPeopleRouter } from "./people/personRoutes.js";
import { createRelationshipRouter } from "./relationships/relationshipRoutes.js";
import { createReminderRouter } from "./reminders/reminderRoutes.js";
import { createSearchRouter } from "./search/searchRoutes.js";

export function createApp(
  config: AppConfig = getConfig(),
  services: { database?: DatabaseSync; databaseHealth?: DatabaseHealth } = {}
): Express {
  const app = express();
  const auth = createAuthController(config);

  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        const allowedOrigins = config.CORS_ORIGIN.split(",")
          .map((value) => value.trim())
          .filter(Boolean);

        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin is not allowed by CORS."));
      }
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      app: "family-registry-api",
      authRequired: auth.required,
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

  app.use("/api/auth", auth.router);

  if (services.database) {
    app.use("/api", auth.requireAuth);
    app.use("/api", createDataTransferRouter(services.database));
    app.use("/api/people", createPeopleRouter(services.database));
    app.use("/api/relationships", createRelationshipRouter(services.database));
    app.use("/api/reminders", createReminderRouter(services.database));
    app.use("/api/search", createSearchRouter(services.database));
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
