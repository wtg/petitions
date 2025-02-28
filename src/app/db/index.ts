import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/app/db/schema';

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(pool, {
    schema
});