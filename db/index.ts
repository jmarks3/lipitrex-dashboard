import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema.js";

// Connection is configured automatically by Netlify — no connection string needed.
export const db = drizzle({ schema });
