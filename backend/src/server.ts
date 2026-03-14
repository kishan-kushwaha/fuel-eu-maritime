import { app } from "./app.js";
import { env } from "./shared/config/env.js";

app.listen(env.port, () => {
  console.log(`Fuel EU Maritime backend running on http://localhost:${env.port}`);
});
