import { type Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["amaranto_*"],
} satisfies Config;
