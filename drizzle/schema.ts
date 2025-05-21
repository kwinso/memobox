import { pgTable, uuid, varchar, timestamp, boolean, time, real, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const albums = pgTable("albums", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	authorId: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	isShared: boolean().default(false).notNull(),
});

export const memoryUploads = pgTable("memory_uploads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	memoryId: uuid().notNull(),
	isImage: boolean().default(false).notNull(),
	uploadUrl: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	time: time(),
});

export const participants = pgTable("participants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	albumId: uuid().notNull(),
	authorId: varchar({ length: 255 }).notNull(),
	isBlocked: boolean().default(false).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const memories = pgTable("memories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	caption: varchar({ length: 255 }).notNull(),
	longitude: real(),
	latitude: real(),
	albumId: uuid().notNull(),
	authorId: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	date: date().notNull(),
});
