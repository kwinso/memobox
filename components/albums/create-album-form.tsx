"use client";

import { createAlbum } from "@/db/queries/albums";
import { useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import React from "react";

export default function CreateAlbumForm() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = React.useState("");
  const [isInvalid, setIsInvalid] = React.useState(false);
  const { user, isLoaded } = useUser();

  async function onSubmit() {
    if (title.length === 0) {
      setIsInvalid(true);
      return;
    }

    await createAlbum(title, user!.id);

    onClose();
  }

  return (
    <>
      {!isLoaded ? (
        <Spinner size="sm" />
      ) : (
        <Button variant="light" color="primary" onClick={onOpen} size="sm">
          add album
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                create album
              </ModalHeader>
              <ModalBody>
                <span className="text-tiny text-default-500">
                  album is a collection of memories. you can share an album with
                  your friends and upload photos or videos to collect your
                  memories in one place.
                </span>
                <Input
                  autoFocus
                  isRequired
                  isInvalid={isInvalid}
                  errorMessage="album title is required"
                  value={title}
                  onValueChange={setTitle}
                  placeholder="album title"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  close
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
