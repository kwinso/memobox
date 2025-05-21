"use client";

import { Link } from "@heroui/react";
import { ChevronRightIcon } from "lucide-react";

import { AlbumWithParticipantInfo } from "@/db/queries/albums";

interface AlbumListItemProps {
  album: AlbumWithParticipantInfo;
}

// TODO: implement deletion
export default function AlbumListItem({ album }: AlbumListItemProps) {
  return (
    <Link
      className="flex justify-between items-center gap-2 border-2 bg-default-100 border-default-200 p-4 rounded-xl w-full"
      color="foreground"
      href={`albums/${album.album.id}`}
    >
      <p>
        {album.album.title} {album.participantId ? "(shared with you)" : ""}
      </p>
      <ChevronRightIcon />
    </Link>
  );
}
