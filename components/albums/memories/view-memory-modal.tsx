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
      <ModalBody>
        {memory.uploads.map((upload) => (
          <div key={upload.id} className="flex flex-col items-center gap-2">
            <Image
              key={upload.id}
              alt={memory.caption}
              className="h-98"
              src={upload.uploadUrl}
            />
            <span className="text-xs text-default-500 mb-4">
              {intlFormat(upload.date, { dateStyle: "medium" })}
            </span>
          </div>
        ))}
        {/* <Image alt={memory.caption} src={memory.uploads[0].uploadUrl} /> */}
      </ModalBody>
      <ModalFooter />
    </>
  );
}
