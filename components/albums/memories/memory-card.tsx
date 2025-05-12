"use client";

import { Memory } from "@/db/types";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { formatDistance, format, intlFormat } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface MemoryCardProps {
  memory: Memory;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isPressable
        disableRipple={true}
        onPress={onOpenChange}
        isFooterBlurred
        className="hover:scale-105 border-2 border-transparent hover:border-primary-200 transition-all box-content"
        radius="lg"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-center">
          <Tooltip
            placement="bottom"
            content={intlFormat(memory.date, {
              year: "numeric",
              day: "numeric",
              month: "long",
              hour: "numeric",
              minute: "numeric",
            })}
          >
            <Chip
              size="sm"
              className="bg-black/10 backdrop-blur backdrop-saturate-150 cursor-pointer border-white/20 border-1"
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{memory.caption}</ModalHeader>
              <ModalBody className="flex items-center">
                <Image alt={memory.caption} src={memory.uploadUrl} />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
