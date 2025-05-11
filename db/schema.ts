import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

const clerkUserId = varchar({ length: 255 });

export const albumsTable = pgTable("ablums", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  authorId: clerkUserId.notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
