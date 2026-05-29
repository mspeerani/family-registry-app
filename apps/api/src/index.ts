import { createApp } from "./app.js";
import { getConfig } from "./config.js";
import { getDatabaseHealth, openDatabase, runMigrations } from "./db/database.js";

const config = getConfig();
const database = openDatabase(config);
const migrationState = runMigrations(database.database);
const app = createApp(config, getDatabaseHealth(config, migrationState));

app.listen(config.APP_PORT, () => {
  console.log(`Family Registry API listening on port ${config.APP_PORT}`);
});

process.on("SIGINT", () => {
  database.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  database.close();
  process.exit(0);
});
