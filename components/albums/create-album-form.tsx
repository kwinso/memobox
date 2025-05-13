"use client";

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

import { createAlbum } from "@/db/queries/albums";

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
        <Button color="primary" size="sm" variant="light" onClick={onOpen}>
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
                  // autoFocus
                  isRequired
                  errorMessage="album title is required"
                  isInvalid={isInvalid}
                  placeholder="album title"
                  value={title}
                  onValueChange={setTitle}
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
