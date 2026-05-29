import { createApp } from "./app.js";
import { getConfig } from "./config.js";

const config = getConfig();
const app = createApp(config);

app.listen(config.APP_PORT, () => {
  console.log(`Family Registry API listening on port ${config.APP_PORT}`);
});

