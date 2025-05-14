"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

/// Checks if the album exists and if it does, is the user the author
export async function checkAlbumExistsForUser(
  id: string,
  user: string,
): Promise<boolean> {
  const ablum = await db.query.albums.findFirst({
    where: (_, { eq, and }) =>
      and(eq(albums.id, id), eq(albums.authorId, user)),
  });

  return ablum !== undefined;
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
      // TODO: Fetching all memories is probably a bad idea
      memories: {
        orderBy: desc(memories.createdAt),
        with: {
          uploads: true,
        },
      },
    },
  });

  return album;
}

export async function createAlbum(title: string, authorId: string) {
  const album = await db.insert(albums).values({ title, authorId }).returning();

  // TODO: This will revalidate for all users, we need to revalidate for the author only
  // Maybe prefix all fields with a `[userId]`?
  revalidatePath("/");

  return album[0].id;
}
