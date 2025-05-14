"use client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

import { Button } from "@heroui/button";
import {
  addToast,
  DatePicker,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { now, getLocalTimeZone, ZonedDateTime } from "@internationalized/date";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

interface AddMemoryFormProps {
  albumId: string;
}

export default function AddMemoryForm({ albumId }: AddMemoryFormProps) {
  const { isOpen, onOpenChange } = useDisclosure();
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState<ZonedDateTime>(now(getLocalTimeZone()));
  const router = useRouter();

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

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                create a memory
                <span className="text-tiny text-default-500">
                  memories are smaller collections or files that are related to
                  some place or event. For example, album for a trip may have
                  multiple memories about different places you visited.
                </span>
              </ModalHeader>
              <ModalBody>
                <Form validationBehavior="aria">
                  <Input
                    isRequired
                    label="caption"
                    labelPlacement="outside"
                    placeholder="enter memory caption"
                    validate={(value) => {
                      if (value.length < 0) {
                        return "memory caption is required";
                      }
                    }}
                    value={caption}
                    variant="bordered"
                    onValueChange={setCaption}
                  />

                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    label="date"
                    labelPlacement="outside"
                    value={date}
                    variant="bordered"
                    onChange={(date) =>
                      setDate(date ?? now(getLocalTimeZone()))
                    }
                  />
                  <UploadDropzone
                    className="!border-default-200 border-2 !border-solid m-auto
                    ut-button:hidden ut-button:rounded-lg ut-button:hover:opacity-hover ut-button:cursor-pointer"
                    config={{
                      mode: "auto",
                    }}
                    content={{
                      label: (
                        <span
                          className={twMerge(
                            "text-primary-500 transition-all",
                            caption.length == 0 && "text-danger-500 ",
                          )}
                        >
                          {caption.length == 0
                            ? "enter caption first"
                            : "upload files"}
                        </span>
                      ),
                      uploadIcon: (
                        <UploadIcon
                          className={twMerge(
                            "text-primary-500 transition-all",
                            caption.length == 0 && "text-danger-500 ",
                          )}
                          size={32}
                        />
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
                    disabled={caption.length == 0}
                    endpoint="createMemoryUploader"
                    input={{
                      albumId: albumId,
                      caption: caption,
                      date: date!.toString(),
                    }}
                    onClientUploadComplete={() => {
                      router.refresh();
                      onClose();
                      addToast({
                        title: "Memory created",
                      });
                    }}
                    onUploadError={(error) => {
                      addToast({
                        title: "Error uploading file",
                        description: error.message,
                      });
                    }}
                  />
                </Form>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={!hasUploaded}
                  onPress={onClose}
                >
                  Done
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
