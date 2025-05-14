import { albums, memories, memoryUploads } from "./schema";

export type Album = typeof albums.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type MemoryUpload = typeof memoryUploads.$inferSelect;
export type MemoryWithUploads = Memory & {
  uploads: MemoryUpload[];
};

export type AlbumWithMemories = Album & {
  memories: Memory[];
};
