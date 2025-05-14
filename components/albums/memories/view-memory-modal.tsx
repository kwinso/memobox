import { ModalHeader, ModalBody, ModalFooter, Image } from "@heroui/react";
import { intlFormat } from "date-fns";

import { MemoryWithUploads } from "@/db/types";

interface ViewMemoryModalProps {
  memory: MemoryWithUploads;
}
export default function ViewMemoryModal({ memory }: ViewMemoryModalProps) {
  return (
    <>
      <ModalHeader>{memory.caption}</ModalHeader>
      <ModalBody className="flex flex-col items-center">
        {memory.uploads.map((upload) => (
          <>
            <Image
              key={upload.id}
              alt={memory.caption}
              className="h-98"
              src={upload.uploadUrl}
            />
            <span className="text-xs text-default-500">
              {intlFormat(upload.date, { dateStyle: "medium" })}
            </span>
          </>
        ))}
        {/* <Image alt={memory.caption} src={memory.uploads[0].uploadUrl} /> */}
      </ModalBody>
      <ModalFooter />
    </>
  );
}
