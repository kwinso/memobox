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
    <Card
      as={Link}
      href={`albums/${album.id}`}
      className="w-full"
      radius="sm"
      isPressable
      shadow="sm"
      isHoverable
    >
      <CardBody>
        <div className="flex justify-between items-center">
          <p>{album.title}</p>
          <ChevronRightIcon />
        </div>
      </CardBody>
    </Card>
  );
}
