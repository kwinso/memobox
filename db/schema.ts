import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  real,
  boolean,
  date,
  time,
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
  date: date({ mode: "date" }).notNull(),
  longitude: real(),
  latitude: real(),
  albumId: uuid().notNull(),
  authorId: clerkUserId.notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const memoriesRelations = relations(memories, ({ one, many }) => ({
  album: one(albums, {
    fields: [memories.albumId],
    references: [albums.id],
  }),
  uploads: many(memoryUploads),
}));

export const memoryUploads = pgTable("memory_uploads", {
  id: uuid().defaultRandom().primaryKey(),
  memoryId: uuid().notNull(),
  time: time({ precision: 0 }),
  isImage: boolean().notNull().default(false),
  uploadUrl: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const memoryUploadsRelations = relations(memoryUploads, ({ one }) => ({
  memory: one(memories, {
    fields: [memoryUploads.memoryId],
    references: [memories.id],
  }),
}));
