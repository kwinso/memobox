"use server";

import { and, desc, eq, or } from "drizzle-orm";

import { db } from "..";
import { albumsTable } from "../schema";
import { Album } from "../types";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export async function getUserAlbums(
  authorId: string,
  page: number = 1,
  perPage: number = 10
): Promise<Album[]> {
  return db
    .select()
    .from(albumsTable)
    .orderBy(desc(albumsTable.createdAt))
    .limit(perPage)
    .offset((page - 1) * perPage)
    .where(eq(albumsTable.authorId, authorId));
}

export async function getAlbumById(id: string) {
  const user = await currentUser();
  const safeId = await z.string().uuid().safeParseAsync(id);

  if (!safeId.success) {
    return null;
  }

  const album = await db
    .select()
    .from(albumsTable)
    .where(
      and(eq(albumsTable.id, safeId.data), eq(albumsTable.authorId, user!.id))
    )
    .execute();

  if (album.length === 0) {
    return null;
  }

  return album[0];
}

export async function createAlbum(title: string, authorId: string) {
  const album = await db
    .insert(albumsTable)
    .values({ title, authorId })
    .returning();

  revalidatePath("/albums");

  return album[0].id;
}
