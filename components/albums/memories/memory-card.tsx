"use client";

import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  useDisclosure,
} from "@heroui/react";
import { BoxIcon, ImageIcon } from "lucide-react";

import MemoryDrawer from "./memory-drawer";

import { MemoryWithUploads } from "@/db/types";

interface MemoryCardProps {
  memory: MemoryWithUploads;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isFooterBlurred
        isPressable
        className="hover:scale-105 border-2 border-transparent hover:border-primary-200 transition-all box-content bg-default-100 h-52"
        disableRipple={true}
        radius="lg"
        onPress={onOpenChange}
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-center">
          <Chip
            className="bg-black/10 backdrop-blur backdrop-saturate-150 cursor-pointer border-white/20 border-1"
            size="sm"
          >
            <div className="flex gap-2 items-center text-white/80">
              <ImageIcon size={12} />
              {memory.uploads.length}{" "}
              {memory.uploads.length > 1 ? "images" : "image"}
            </div>
          </Chip>
        </CardHeader>
        {memory.uploads.length > 0 ? (
          <Image
            removeWrapper
            alt={memory.caption}
            className="z-0 w-full object-cover max-h-52"
            src={memory.uploads[0].uploadUrl}
          />
        ) : (
          <BoxIcon className="m-auto" size={32} />
        )}
        <CardFooter className="flex-col items-start bg-black/10  before:bg-black/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-sm text-white/80">{memory.caption}</p>
        </CardFooter>
      </Card>

      <MemoryDrawer
        initialState={{ memory, uploads: memory.uploads }}
        isOpen={isOpen}
        onClose={onOpenChange}
      />
    </>
  );
}
