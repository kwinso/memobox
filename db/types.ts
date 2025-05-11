import { albumsTable } from "./schema";

export type Album = typeof albumsTable.$inferSelect;
