"use server";

import { db } from "..";
import { memories, memoryUploads } from "../schema";
import { CreateMemory } from "../types";

export async function createMemory(data: CreateMemory) {
  return db.insert(memories).values(data).returning();
}

export async function addMemoryUpload(memoryId: string, uploadUrl: string) {
  return db
    .insert(memoryUploads)
    .values({
      memoryId,
      uploadUrl,
      // TODO: A quick hack for now, later we meed to
      date: new Date(),
    })
    .returning();
}
