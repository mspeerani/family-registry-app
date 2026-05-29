import { getConfig } from "../config.js";
import { getMigrationState, openDatabase, runMigrations } from "./database.js";
import { seedFakeData } from "./seed.js";

const command = process.argv[2];
const config = getConfig();
const handle = openDatabase(config);

try {
  if (command === "migrate") {
    const state = runMigrations(handle.database);
    console.log(
      `Migrations complete. Applied=${state.applied.length} Pending=${state.pending.length}`
    );
  } else if (command === "seed") {
    runMigrations(handle.database);
    seedFakeData(handle.database);
    const state = getMigrationState(handle.database);
    console.log(`Fake seed complete. Applied=${state.applied.length}`);
  } else {
    console.error("Usage: npm run db:migrate | npm run db:seed");
    process.exitCode = 1;
  }
} finally {
  handle.close();
}

