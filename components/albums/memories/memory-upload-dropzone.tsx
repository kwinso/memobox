import { addToast } from "@heroui/react";
import { generateUploadDropzone } from "@uploadthing/react";
import { UploadIcon, WandSparklesIcon } from "lucide-react";

import { UploadRouter } from "@/app/api/uploadthing/core";
import { MemoryUpload } from "@/db/types";

const UploadDropzone = generateUploadDropzone<UploadRouter>();

interface MemoryUploadDropzoneProps {
  memoryId: string;
  onUploadComplete: (upload: MemoryUpload[]) => void;
}

export default function MemoryUploadDropzone({
  memoryId,
  onUploadComplete,
}: MemoryUploadDropzoneProps) {
  return (
    <UploadDropzone
      className="bg-default-100 hover:bg-default-200 transition-all cursor-pointer border-0 !border-solid w-full
                    ut-button:hidden ut-button:rounded-lg ut-button:hover:opacity-hover ut-button:cursor-pointer"
      config={{
        mode: "auto",
      }}
      content={{
        label: <span className="text-primary-500 transition-all" />,
        uploadIcon: (
          <UploadIcon className="text-primary-500 transition-all" size={32} />
        ),
        button({ ready, isUploading }) {
          if (!ready) return "loading...";
          if (isUploading) return "uploading...";

          return "upload";
        },
        allowedContent({ fileTypes, ready, isUploading }) {
          if (!ready) return "checking allowed file types...";
          if (isUploading) return "uploading images...";

          return `you can upload: ${fileTypes.join(", ")}`;
        },
      }}
      endpoint="createMemoryUploader"
      input={memoryId}
      onBeforeUploadBegin={(files) => {
        return files.map(
          (f) =>
            new File([f], `memory-${memoryId}-upload-${Date.now()}`, {
              type: f.type,
            }),
        );
      }}
      onClientUploadComplete={(uploads) => {
        onUploadComplete(
          uploads.map(({ serverData: upload }) => ({
            ...upload,
            createdAt: new Date(upload.createdAt),
          })),
        );
      }}
      onUploadBegin={() => {
        addToast({
          title: "uploading started...",
          icon: <WandSparklesIcon size={20} />,
          description: `memories are are being uploaded to memobox`,
        });
      }}
      onUploadError={(error) => {
        addToast({
          severity: "danger",
          title: "error uploading file",
          description: error.message,
        });
      }}
    />
  );
}
