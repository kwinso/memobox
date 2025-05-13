import { ModalHeader, ModalBody, ModalFooter, Image } from "@heroui/react";

import { Memory } from "@/db/types";

interface ViewMemoryModalProps {
  memory: Memory;
}
export default function ViewMemoryModal({ memory }: ViewMemoryModalProps) {
  return (
    <>
      <ModalHeader>{memory.caption}</ModalHeader>
      <ModalBody className="flex items-center">
        <Image alt={memory.caption} src={memory.uploadUrl} />
      </ModalBody>
      <ModalFooter />
    </>
  );
}
