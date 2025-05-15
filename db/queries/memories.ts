"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "..";
import { albums, memories, memoryUploads } from "../schema";
import { MemoryInsertData } from "../types";

export async function canUploadToMemory(memoryId: string, userId: string) {
  const memory = await db
    .select({ id: memories.id })
    .from(memories)
    .leftJoin(albums, eq(memories.albumId, albums.id))
    .where(and(eq(memories.id, memoryId), eq(albums.authorId, userId!)))
    .execute();

  return memory.length > 0;
}

export async function createMemory(data: Omit<MemoryInsertData, "authorId">) {
  const schema = z
    .object({
      caption: z.string().min(1),
      date: z.date(),
      albumId: z.string().uuid(),
      longitude: z.number().min(-180).max(180).optional(),
      latitude: z.number().min(-90).max(90).optional(),
    })
    .superRefine(({ latitude, longitude }, ctx) => {
      // Latitude and longitude must always be present together
      if (!!latitude !== !!longitude) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "latitude and longitude must always be present together",
        });
      }
    });
  const validated = schema.parse(data);

  const user = await auth();

  const memory = await db
    .insert(memories)
    .values({
      caption: validated.caption,
      date: validated.date,
      albumId: validated.albumId,
      authorId: user.userId!,
      longitude: validated.longitude,
    })
    .returning();

  return memory[0];
}

export async function addMemoryUpload(
  memoryId: string,
  uploadUrl: string,
  isImage: boolean = true,
) {
  const upload = await db
    .insert(memoryUploads)
    .values({
      memoryId,
      isImage,
      uploadUrl,
      // TODO: A quick hack for now, later we meed to
      time: "13:00",
    })
    .returning();

  return upload[0];
}
