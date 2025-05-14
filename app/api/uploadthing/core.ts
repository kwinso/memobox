import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { string, z } from "zod";
import { revalidatePath } from "next/cache";

import { addMemoryUpload, createMemory } from "@/db/queries/memories";
import { checkAlbumExistsForUser } from "@/db/queries/albums";

const f = createUploadthing();

export const fileRouter = {
  createMemoryUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileCount: 5,
      maxFileSize: "4MB",
    },
    video: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .input(
      z.object({
        albumId: string().uuid(),
        caption: z.string().min(1),
        date: z.string().transform((str) => new Date(str)),
      }),
    )
    .middleware(async ({ input }) => {
      const user = await auth();

      if (!user) throw new UploadThingError("Unauthorized");

      if (!checkAlbumExistsForUser(input.albumId, user.userId!)) {
        throw new UploadThingError("Cannot create memories for this album");
      }

      const memory = await createMemory({
        authorId: user.userId!,
        albumId: input.albumId,
        caption: input.caption,
      });

      return { memoryId: memory[0].id, albumId: input.albumId };
    })
    .onUploadError(async () => {
      // TODO: Handle error
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { memoryId, albumId } = metadata;

      // TODO: Should set the type properly (image or video)
      await addMemoryUpload(memoryId, file.ufsUrl);

      revalidatePath(`/albums/${albumId}`);

      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
