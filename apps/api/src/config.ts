import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  APP_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().default("file:./data/family_registry.sqlite"),
  DEFAULT_LOCALE: z.enum(["en", "ur", "gu"]).default("en"),
  SESSION_SECRET: z.string().optional(),
  UPLOAD_DIR: z.string().default("./data/uploads")
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

