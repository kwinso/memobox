import { albums, memories, memoryUploads, participants } from "./schema";

export type Album = typeof albums.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type MemoryUpload = typeof memoryUploads.$inferSelect;
export type AlbumParticipant = typeof participants.$inferSelect;
export type MemoryWithUploads = Memory & {
  uploads: MemoryUpload[];
};
export type AlbumDetails = Album & {
  memories: MemoryWithUploads[];
  participants: AlbumParticipant[];
};

export type MemoryInsertData = typeof memories.$inferInsert;
export type CreateMemoryUpload = typeof memoryUploads.$inferInsert;
