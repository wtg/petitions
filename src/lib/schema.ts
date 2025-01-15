// import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    // delete this password for production, we are not using password credential
    password: text("password"),
    // email: text("email").unique(),
    // emailVerified: timestamp("emailVerified", { mode: "date" }),
    // image: text("image"),
});

export const accounts = pgTable("account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        // refresh_token: text("refresh_token"),
        // access_token: text("access_token"),
        // expires_at: integer("expires_at"),
        // token_type: text("token_type"),
        // scope: text("scope"),
        // id_token: text("id_token"),
        // session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
);