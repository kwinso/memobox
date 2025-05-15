import {
  Card,
  CardHeader,
  Chip,
  Modal,
  useDisclosure,
  Image,
  ModalContent,
  Button,
} from "@heroui/react";
import { ClockIcon, XIcon } from "lucide-react";

import { MemoryUpload } from "@/db/types";

interface MemoryUploadCardProps {
  upload: MemoryUpload;
}

export default function MemoryUploadCard({ upload }: MemoryUploadCardProps) {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        isFooterBlurred
        isPressable
        className="border-2 border-transparent hover:border-primary-200 transition-all box-content"
        radius="lg"
        onPress={onOpenChange}
      >
        <CardHeader className="absolute flex-col items-center z-10">
          <Chip
            className="bg-black/10 backdrop-blur backdrop-saturate-150 cursor-pointer border-white/20 border-1"
            size="sm"
          >
            <div className="flex gap-2 items-center text-white/80">
              <ClockIcon size={12} />
              {upload.time?.slice(0, 5)}
            </div>
          </Chip>
        </CardHeader>
        <Image
          removeWrapper
          alt={upload.id}
          className="object-cover h-full z-0"
          src={upload.uploadUrl}
        />
      </Card>

      <Modal
        hideCloseButton
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-fit h-fit">
          {(onClose) => (
            <div className="flex relative">
              <Button
                isIconOnly
                className="absolute top-2 right-2 z-30 h-6"
                variant="solid"
                onPress={onClose}
              >
                <XIcon size={12} />
              </Button>
              <Image
                alt={upload.id}
                className="w-full h-full z-0"
                src={upload.uploadUrl}
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
