import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "~/env.mjs";

async function main() {

  const db = drizzle(createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  }));

  console.log('Running migrations for', env.DATABASE_URL)

  await migrate(db, { migrationsFolder: "migrations" });

  console.log('Migrated successfully')

  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed')
  console.error(e)
  process.exit(1)
});

