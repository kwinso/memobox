import { useContext } from "react";

import { AlbumMemoriesContext } from "../album-view";

import MemoryCard from "./memory-card";
import AddMemoryButton from "./add-memory-form";

interface MemoriesGalleryViewProps {
  albumId: string;
}

export default function MemoriesGalleryView({
  albumId,
}: MemoriesGalleryViewProps) {
  const { memories } = useContext(AlbumMemoriesContext);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full gap-2 h-fit items-center justify-between">
        <h3 className="text-xl font-bold">memories ({memories.length})</h3>
        <AddMemoryButton albumId={albumId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </div>
  );
}
