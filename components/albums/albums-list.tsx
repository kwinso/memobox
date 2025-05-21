"use client";
import { useState } from "react";

import CreateAlbumForm from "./create-album-form";
import AlbumListItem from "./album-list-item";

import { AlbumWithParticipantInfo } from "@/db/queries/albums";

interface AlbumsListProps {
  initialAlbums: AlbumWithParticipantInfo[];
}
export default function AlbumsList({ initialAlbums }: AlbumsListProps) {
  const [albums, setAlbums] =
    useState<AlbumWithParticipantInfo[]>(initialAlbums);

  return (
    <div className="flex w-full md:w-1/2 flex-col gap-4">
      <div className="flex w-full items-center justify-between h-6">
        <h5 className="text-xl font-bold">your albums</h5>
        <CreateAlbumForm
          onCreate={(album) =>
            setAlbums([{ album, participantId: null }, ...albums])
          }
        />
      </div>
      {albums.length > 0 ? (
        <div className="flex flex-col w-full gap-4">
          {albums.map((albumInfo) => (
            <AlbumListItem key={albumInfo.album.id} album={albumInfo} />
          ))}
        </div>
      ) : (
        <span className="text-sm text-default-500">
          you have no albums yet, create one using a button above.
        </span>
      )}
    </div>
  );
}
