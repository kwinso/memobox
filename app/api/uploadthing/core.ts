import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

import { addMemoryUpload, canUploadToMemory } from "@/db/queries/memories";

const f = createUploadthing();

export const fileRouter = {
  createMemoryUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
    },
    // TODO: Allow for video
    // video: {
    //   maxFileSize: "16MB",
    // },
  })
    .input(z.string().uuid())
    .middleware(async ({ input: memoryId }) => {
      const user = await auth();

      if (!user) throw new UploadThingError("Unauthorized");

      if (!canUploadToMemory(memoryId, user.userId!)) {
        throw new UploadThingError("Cannot create memories for this album");
      }

      return { memoryId };
    })
    .onUploadError(async () => {
      // TODO: Handle error
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { memoryId } = metadata;

      // TODO: Should set the type properly (image or video)
      const upload = await addMemoryUpload(memoryId, file.ufsUrl);

      return { ...upload, createdAt: upload.createdAt.toISOString() };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof fileRouter;
