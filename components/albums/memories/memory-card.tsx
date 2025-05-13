"use client";

import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Modal,
  ModalContent,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { formatDistance, intlFormat } from "date-fns";
import { ClockIcon } from "lucide-react";

import ViewMemoryModal from "./view-memory-modal";

import { Memory } from "@/db/types";

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isFooterBlurred
        isPressable
        className="hover:scale-105 border-2 border-transparent hover:border-primary-200 transition-all box-content"
        disableRipple={true}
        radius="lg"
        onPress={onOpenChange}
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-center">
          <Tooltip
            content={intlFormat(memory.date, {
              year: "numeric",
              day: "numeric",
              month: "long",
              hour: "numeric",
              minute: "numeric",
            })}
            placement="bottom"
          >
            <Chip
              className="bg-black/10 backdrop-blur backdrop-saturate-150 cursor-pointer border-white/20 border-1"
              size="sm"
            >
              <div className="flex gap-2 items-center text-white/80">
                <ClockIcon size={12} />
                {formatDistance(memory.date, new Date(), { addSuffix: true })}
              </div>
            </Chip>
          </Tooltip>
        </CardHeader>
        <Image
          removeWrapper
          alt={memory.caption}
          className="z-0 w-full h-full object-cover max-h-52"
          src={memory.uploadUrl}
        />
        <CardFooter className="flex-col items-start bg-black/10  before:bg-black/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-sm text-white/80">{memory.caption}</p>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} size="3xl" onOpenChange={onOpenChange}>
        <ModalContent>{() => <ViewMemoryModal memory={memory} />}</ModalContent>
      </Modal>
    </>
  );
}
