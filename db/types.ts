import { albums, memories } from "./schema";

export type Album = typeof albums.$inferSelect;
export type Memory = typeof memories.$inferSelect;

export type AlbumWithMemories = Album & {
  memories: Memory[];
};
