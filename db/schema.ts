import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    boolean,
    index,
    integer,
    serial,
    varchar,
    pgEnum,
    primaryKey,
} from "drizzle-orm/pg-core";

// ============================================================================
// Enums
// ============================================================================

export const rolesEnum = pgEnum("roles", ["admin", "moderator", "user"]);
export const petitionStatusEnum = pgEnum("petition_status", [
    "open",
    "responded",
    "resolved",
]);

// ============================================================================
// BetterAuth Tables
// ============================================================================

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    role: rolesEnum("role").notNull().default("user"),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ============================================================================
// Application Tables
// ============================================================================

export const petition = pgTable(
    "petition",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description").notNull(),
        authorId: text("author_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        status: petitionStatusEnum("status").notNull().default("open"),
    },
    (table) => [index("petition_authorId_idx").on(table.authorId)],
);

export const signature = pgTable(
    "signature",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        petitionId: integer("petition_id")
            .notNull()
            .references(() => petition.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.userId, table.petitionId] }),
        index("signature_petitionId_idx").on(table.petitionId),
    ],
);

export const tag = pgTable("tag", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
});

export const petitionTag = pgTable(
    "petition_tag",
    {
        tagId: integer("tag_id")
            .notNull()
            .references(() => tag.id, { onDelete: "cascade" }),
        petitionId: integer("petition_id")
            .notNull()
            .references(() => petition.id, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({ columns: [table.tagId, table.petitionId] }),
        index("petition_tag_petitionId_idx").on(table.petitionId),
    ],
);

export const response = pgTable(
    "response",
    {
        id: serial("id").primaryKey(),
        petitionId: integer("petition_id")
            .notNull()
            .references(() => petition.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        response: text("response").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("response_petitionId_idx").on(table.petitionId),
        index("response_petition_time_idx").on(table.petitionId, table.createdAt),
    ],
);

// ============================================================================
// Relations
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    petitions: many(petition),
    signatures: many(signature),
    responses: many(response),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const petitionRelations = relations(petition, ({ one, many }) => ({
    author: one(user, {
        fields: [petition.authorId],
        references: [user.id],
    }),
    signatures: many(signature),
    tags: many(petitionTag),
    responses: many(response),
}));

export const signatureRelations = relations(signature, ({ one }) => ({
    user: one(user, {
        fields: [signature.userId],
        references: [user.id],
    }),
    petition: one(petition, {
        fields: [signature.petitionId],
        references: [petition.id],
    }),
}));

export const tagRelations = relations(tag, ({ many }) => ({
    petitions: many(petitionTag),
}));

export const petitionTagRelations = relations(petitionTag, ({ one }) => ({
    tag: one(tag, {
        fields: [petitionTag.tagId],
        references: [tag.id],
    }),
    petition: one(petition, {
        fields: [petitionTag.petitionId],
        references: [petition.id],
    }),
}));

export const responseRelations = relations(response, ({ one }) => ({
    petition: one(petition, {
        fields: [response.petitionId],
        references: [petition.id],
    }),
    user: one(user, {
        fields: [response.userId],
        references: [user.id],
    }),
}));
