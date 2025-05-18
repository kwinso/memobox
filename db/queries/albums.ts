"use server";

import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { db } from "..";
import { albums, memories } from "../schema";
import { Album, AlbumWithMemories } from "../types";

export async function getUserAlbums(
  authorId: string,
  page: number = 1,
  perPage: number = 10,
): Promise<Album[]> {
  return db
    .select()
    .from(albums)
    .orderBy(desc(albums.createdAt))
    .limit(perPage)
    .offset((page - 1) * perPage)
    .where(eq(albums.authorId, authorId));
}

export async function getAlbumById(
  id: string,
): Promise<AlbumWithMemories | undefined> {
  const user = await currentUser();
  const safeId = await z.string().uuid().safeParseAsync(id);

  if (!safeId.success) {
    return undefined;
  }

  const album = await db.query.albums.findFirst({
    where: (_, { eq, and }) =>
      and(eq(albums.id, safeId.data), eq(albums.authorId, user!.id)),
    with: {
      memories: {
        orderBy: desc(memories.createdAt),
        with: {
          uploads: {
            limit: 1, // just fetch the first one for the thumbnail
          },
        },
      },
    },
  });

  return album;
}

export async function createAlbum(title: string, authorId: string) {
  const album = await db.insert(albums).values({ title, authorId }).returning();

  return album[0];
}
