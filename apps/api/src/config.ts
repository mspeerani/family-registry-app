import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  APP_ADMIN_PASSWORD: z.string().optional(),
  APP_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().default("file:./data/family_registry.sqlite"),
  DEFAULT_LOCALE: z.enum(["en", "ur", "gu"]).default("en"),
  SESSION_SECRET: z.string().optional(),
  UPLOAD_DIR: z.string().default("./data/uploads")
}).superRefine((config, context) => {
  if (config.APP_ADMIN_PASSWORD && (!config.SESSION_SECRET || config.SESSION_SECRET.length < 32)) {
    context.addIssue({
      code: "custom",
      message: "SESSION_SECRET must be at least 32 characters when APP_ADMIN_PASSWORD is set.",
      path: ["SESSION_SECRET"]
    });
  }

  if (config.APP_ENV !== "production") {
    return;
  }

  if (!config.APP_ADMIN_PASSWORD || config.APP_ADMIN_PASSWORD.length < 12) {
    context.addIssue({
      code: "custom",
      message: "APP_ADMIN_PASSWORD must be at least 12 characters in production.",
      path: ["APP_ADMIN_PASSWORD"]
    });
  }

  if (!config.SESSION_SECRET || config.SESSION_SECRET.length < 32) {
    context.addIssue({
      code: "custom",
      message: "SESSION_SECRET must be at least 32 characters in production.",
      path: ["SESSION_SECRET"]
    });
  }
});

export type AppConfig = z.infer<typeof configSchema>;

export function getConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = configSchema.safeParse(env);

  if (!result.success) {
    throw new Error(`Invalid application configuration: ${result.error.message}`);
  }

  return result.data;
}

export function redactDatabaseUrl(databaseUrl: string): string {
  if (databaseUrl.startsWith("file:")) {
    return "file:<local-sqlite-path>";
  }

  return "<configured>";
}
