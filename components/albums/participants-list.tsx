import {
  addToast,
  Avatar,
  AvatarGroup,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Switch } from "@heroui/switch";
import { LinkIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { toggleAlbumShared } from "@/db/queries/albums";
import { api } from "@/api";

interface ParticipantsListProps {
  isAlbumShared: boolean;
  albumId: string;
  participantsIds: string[];
  shouldShowControls: boolean;
}

export default function ParticipantsList({
  shouldShowControls,
  isAlbumShared,
  albumId,
  participantsIds,
}: ParticipantsListProps) {
  const [isShared, setIsShared] = useState(isAlbumShared);
  const {
    isOpen: isShareModalOpen,
    onOpenChange: onShareModalOpenChange,
    onOpen: onShareModalOpen,
  } = useDisclosure();
  const {
    isOpen: isConfirmModalOpen,
    onOpenChange: onConfirmModalOpenChange,
    onOpen: onConfirmModalOpen,
  } = useDisclosure();

  const [participants, setParticipants] = useState<
    { id: string; imageUrl: string }[]
  >([]);

  useEffect(() => {
    api.participants
      .getParticipantsImageUrls(participantsIds)
      .then(setParticipants);
  }, [participantsIds]);

  async function onToggleShared() {
    const newValue = !isShared;

    setIsShared(newValue);
    if (newValue) {
      await toggleAlbumShared(albumId, true);
      onShareModalOpen();
    } else {
      onConfirmModalOpen();
    }
  }

  return (
    <>
      <div className="bg-default-100 flex flex-col gap-4 h-fit border-2 border-default-200 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Participants</h3>
          <div className="flex items-center gap-2 text-xs text-default-500">
            {shouldShowControls && (
              <Switch
                isSelected={isShared}
                size="sm"
                onChange={onToggleShared}
              />
            )}
          </div>
        </div>
        {isShared && (
          <div className="flex gap-2 items-center">
            {participantsIds.length > 0 ? (
              <AvatarGroup isBordered isGrid>
                {participants.map(({ id, imageUrl }) => (
                  <Avatar key={id} src={imageUrl} />
                ))}
              </AvatarGroup>
            ) : (
              <p className="text-sm text-default-500">no people joined yet</p>
            )}
          </div>
        )}
      </div>

      <Modal
        closeButton={
          <Button
            isIconOnly
            variant="light"
            onPress={() => {
              setIsShared(true); // back to sharing
            }}
          >
            <XIcon size={15} />
          </Button>
        }
        isDismissable={false}
        isOpen={isConfirmModalOpen}
        onOpenChange={onConfirmModalOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>are you sure?</ModalHeader>
              <ModalBody>
                turning participation off will remove all existing participants
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setIsShared(true); // back to sharing
                    onClose();
                  }}
                >
                  cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    toggleAlbumShared(albumId, false);
                    onClose();
                  }}
                >
                  turn off
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isShareModalOpen} onOpenChange={onShareModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                album shared
              </ModalHeader>
              <ModalBody>
                you now can share a link to this album with your friends. they
                will appear in the participants list as they join
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  close
                </Button>
                <Button
                  color="primary"
                  endContent={<LinkIcon size={16} />}
                  variant="flat"
                  onPress={() => {
                    const relativeUrl = new URL(window.location.href);

                    relativeUrl.pathname = `/albums/${albumId}/join`;
                    navigator.clipboard.writeText(relativeUrl.toString());
                    addToast({
                      icon: <LinkIcon />,
                      color: "success",
                      title: "Link copied to clipboard",
                    });
                  }}
                >
                  copy link
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
