// import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable("users", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    // delete this password for production, we are not using password credential
    password: text("password"),
});