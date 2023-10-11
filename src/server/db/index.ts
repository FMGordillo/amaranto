import { drizzle } from "drizzle-orm/libsql";
import { env } from "~/env.mjs";
import { createClient } from '@libsql/client';

// TODO: Add support for authToken when app is ready for coding
const client = createClient({ url: env.DATABASE_URL });

export const db = drizzle(client);
