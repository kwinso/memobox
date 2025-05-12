"use client";

import { Album } from "@/db/types";
import { Card, CardBody, Link } from "@heroui/react";
import { ChevronRightIcon } from "lucide-react";

interface AlbumListItemProps {
  album: Album;
}

// TODO: implement deletion
export default function AlbumListItem({ album }: AlbumListItemProps) {
  return (
    <Link
      color="foreground"
      href={`albums/${album.id}`}
      className="flex justify-between items-center gap-2 border-2 bg-default-100 border-default-200 p-4 rounded-xl w-full"
    >
      <p>{album.title}</p>
      <ChevronRightIcon />
    </Link>
  );
}
