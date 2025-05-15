"use client";
import type { UploadRouter } from "@/app/api/uploadthing/core";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { UploadIcon } from "lucide-react";
import { generateUploadDropzone } from "@uploadthing/react";

import MemoryDrawer from "./memory-drawer";

export const UploadDropzone = generateUploadDropzone<UploadRouter>();

interface AddMemoryFormProps {
  albumId: string;
}

export default function AddMemoryButton({ albumId }: AddMemoryFormProps) {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        size="sm"
        startContent={<UploadIcon size={15} />}
        variant="flat"
        onPress={onOpenChange}
      >
        add memory
      </Button>

      <MemoryDrawer
        initialState={{
          memory: {
            albumId,
          },
          uploads: [],
        }}
        isOpen={isOpen}
        onClose={onOpenChange}
      />
    </>
  );
}
