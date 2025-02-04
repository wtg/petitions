import { pgTable, primaryKey, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

import { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable("users", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    // delete this password for production, we are not using password credential
    password: text("password"),
});

export const petitions = pgTable("petitions", {
    name: text().notNull(),
    id: serial().primaryKey(),
    description: text().notNull(),
    author: text().notNull(), 
    creationDate: timestamp()
        .defaultNow()
        .notNull(),
});

export const tagNames = pgTable("tagNames", {
    tagId: serial().primaryKey(),
    tagName: text().notNull(),
});

export const signatures = pgTable("signatures", {
    userId: text()
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    petitionId: integer()
        .notNull()
        .references(() => petitions.id, { onDelete: "cascade" }),
}, (table) => ([
    primaryKey({ columns: [table.userId, table.petitionId] })
]));

export const responses = pgTable("responses", {
    petitionId: integer()
        .notNull()
        .references(() => petitions.id, { onDelete: "cascade" }),
    userId: text()
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    response: text().notNull(),
    responseTime: timestamp()
    .defaultNow()
    .notNull(),
});

export const tagRefs = pgTable("tagRefs", {
    tagId: integer()
        .notNull()
        .references(() => tagNames.tagId, { onDelete: "cascade" }),
    petitionId: integer()
        .notNull()
        .references(() => petitions.id, { onDelete: "cascade" }),
}, (table) => ([
    primaryKey({ columns: [table.tagId, table.petitionId] })
]));