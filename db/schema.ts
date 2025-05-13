import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  real,
  boolean,
} from "drizzle-orm/pg-core";

const clerkUserId = varchar({ length: 255 });

export const albums = pgTable("albums", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  isShared: boolean().notNull().default(false),
  authorId: clerkUserId.notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const albumRelations = relations(albums, ({ many }) => ({
  // participants: many(participants),
  memories: many(memories),
}));

// export const participants = pgTable("participants", {
//   id: uuid().defaultRandom().primaryKey(),
//   name: varchar({ length: 255 }).notNull(),
//   albumId: uuid().notNull(),
//   userId: clerkUserId.notNull(),
//   createdAt: timestamp().notNull().defaultNow(),
// });

export const memories = pgTable("memories", {
  id: uuid().defaultRandom().primaryKey(),
  caption: varchar({ length: 255 }).notNull(),
  isImage: boolean().notNull().default(false),
  uploadUrl: varchar({ length: 255 }).notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
  longitude: real(),
  latitude: real(),
  albumId: uuid().notNull(),
  authorId: clerkUserId.notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const memoriesRelations = relations(memories, ({ one }) => ({
  album: one(albums, {
    fields: [memories.albumId],
    references: [albums.id],
  }),
}));
