"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getParticipantsImageUrls(participants: string[]) {
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({ userId: participants });

  return users.data.map((user) => ({ id: user.id, imageUrl: user.imageUrl }));
}
