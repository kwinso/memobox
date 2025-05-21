"use client";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { CircleXIcon } from "lucide-react";
import { useState } from "react";

import { joinAlbum } from "@/db/queries/albums";

interface JoinAlbumButtonProps {
  albumId: string;
  userId: string;
}

export default function JoinAlbumButton({
  albumId,
  userId,
}: JoinAlbumButtonProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  async function onJoin() {
    try {
      setIsJoining(true);
      await joinAlbum(albumId, userId);
      router.push(`/albums/${albumId}`);
    } catch (e: any) {
      addToast({
        icon: <CircleXIcon />,
        severity: "danger",
        color: "danger",
        title: "Could not join album",
        description: e.message ?? "Something went wrong",
      });
    }
  }

  return (
    <Button
      color="primary"
      isLoading={isJoining}
      variant="shadow"
      onPress={onJoin}
    >
      {isJoining ? "joining..." : "start sharing memories"}
    </Button>
  );
}
