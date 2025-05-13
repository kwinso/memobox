"use client";

import { Link } from "@heroui/react";
import { ChevronRightIcon } from "lucide-react";

import { Album } from "@/db/types";

interface AlbumListItemProps {
  album: Album;
}

// TODO: implement deletion
export default function AlbumListItem({ album }: AlbumListItemProps) {
  return (
    <Link
      className="flex justify-between items-center gap-2 border-2 bg-default-100 border-default-200 p-4 rounded-xl w-full"
      color="foreground"
      href={`albums/${album.id}`}
    >
      <p>{album.title}</p>
      <ChevronRightIcon />
    </Link>
  );
}
