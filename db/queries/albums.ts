"use server";

import { and, desc, eq, or } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { db } from "..";
import { albums, memories, participants } from "../schema";
import { Album, AlbumDetails } from "../types";

export async function getAlbumJoinInfo(albumId: string) {
  const album = await db
    .select({ title: albums.title, isShared: albums.isShared })
    .from(albums)
    .where(eq(albums.id, albumId));

  return album[0];
}

export interface AlbumWithParticipantInfo {
  album: Album;
  participantId: string | null;
}

export async function getUserAlbums(
  authorId: string,
  page: number = 1,
  perPage: number = 10,
): Promise<AlbumWithParticipantInfo[]> {
  const albumsParticipants = await db
    .select({ album: albums, participantId: participants.userId })
    .from(albums)
    .orderBy(desc(albums.createdAt))
    .leftJoin(participants, eq(participants.albumId, albums.id))
    .limit(perPage)
    .offset((page - 1) * perPage)
    .where(
      or(eq(albums.authorId, authorId), eq(participants.userId, authorId)),
    );

  return albumsParticipants;
}

export async function getAlbumById(
  id: string,
): Promise<AlbumDetails | undefined> {
  const user = await currentUser();
  const safeId = await z.string().uuid().safeParseAsync(id);

  if (!safeId.success) {
    return undefined;
  }

  const album = await db.query.albums.findFirst({
    where: (_, { eq }) => eq(albums.id, safeId.data),
    with: {
      participants: true,
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

  if (!album) {
    throw new Error("Album not found");
  }

  if (album.authorId !== user!.id) {
    const participant =
      album.participants.find((p) => p.userId === user!.id) != null;

    if (!album.isShared || !participant) {
      throw new Error("Album not found");
    }
  }

  return album;
}

export async function toggleAlbumShared(albumId: string, isShared: boolean) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const album = await db.select().from(albums).where(eq(albums.id, albumId));

  if (!album[0] || album[0].authorId !== user!.id) {
    throw new Error("Album shared state can be changed only by the author");
  }

  if (album[0].isShared && !isShared) {
    // Delete all participants
    await db.delete(participants).where(eq(participants.albumId, albumId));
  }

  await db.update(albums).set({ isShared }).where(eq(albums.id, albumId));
}

export async function isParticipant(albumId: string, userId: string) {
  const res = await db
    .select()
    .from(participants)
    .where(
      and(eq(participants.albumId, albumId), eq(participants.userId, userId)),
    );

  return res.length > 0;
}

export async function joinAlbum(albumId: string, userId: string) {
  const album = await db.select().from(albums).where(eq(albums.id, albumId));

  if (!album[0]) {
    throw new Error("Album not found");
  }

  if (!album[0].isShared) {
    throw new Error(
      "This album cannot be joined because it is not shared. Make sure the album owner is still sharing it.",
    );
  }

  if (!(await isParticipant(albumId, userId))) {
    await db.insert(participants).values({ albumId, userId });
  }
}

export async function createAlbum(title: string, authorId: string) {
  const album = await db.insert(albums).values({ title, authorId }).returning();

  return album[0];
}
