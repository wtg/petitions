import { pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    username: text('username').notNull().unique(),
    password: text('password').notNull()
});