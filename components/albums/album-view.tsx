"use client";
import { createContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useUser } from "@clerk/nextjs";

import AlbumPageHeader from "./album-page-header";
import MemoriesTimeline from "./memories/memories-timeline";
import MemoriesGalleryView from "./memories/memories-gallery-view";
import MemoriesMapView from "./memories/memories-map-view";
import ParticipantsList from "./participants-list";

import { AlbumDetails, MemoryUpload, MemoryWithUploads } from "@/db/types";

interface AlbumParams {
  album: AlbumDetails;
}

export const AlbumMemoriesContext = createContext<{
  mode: "gallery" | "map";
  setMode: (v: "gallery" | "map") => void;
  memories: MemoryWithUploads[];
  addMemory: (memory: MemoryWithUploads) => void;
  addMemoryUploads: (memoryId: string, upload: MemoryUpload[]) => void;
}>({
  mode: "gallery",
  setMode: (_: "gallery" | "map") => {},
  memories: [],
  addMemory: (_: MemoryWithUploads) => {},
  addMemoryUploads: (_1: string, _2: MemoryUpload[]) => {},
});

export default function AlbumView({ album }: AlbumParams) {
  const { user, isLoaded } = useUser();
  const [memories, setMemories] = useState<MemoryWithUploads[]>(album.memories);
  const [viewMode, setViewMode] = useState<"gallery" | "map">("gallery");
  const [renderMaps, setRenderMaps] = useState(false);
  const [selectedMemory, setSelectedMemory] =
    useState<MemoryWithUploads | null>(null);

  // Make sure maps are only loaded once when the user actually wants to see them
  useEffect(() => {
    if (viewMode === "map" && !renderMaps) {
      setRenderMaps(true);
    }
  }, [viewMode]);

  return (
    <AlbumMemoriesContext.Provider
      value={{
        memories,
        addMemory: (memory) => {
          setMemories([memory, ...memories]);
        },
        addMemoryUploads: (memoryId, uploads) => {
          const updatedMemories = memories.map((memory) => {
            if (memory.id === memoryId) {
              return { ...memory, uploads };
            }

            return memory;
          });

          setMemories(updatedMemories);
        },
        mode: viewMode,
        setMode: (mode) => {
          setSelectedMemory(null);
          setViewMode(mode);
        },
      }}
    >
      <>
        <AlbumPageHeader title={album.title} />

        <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
          <div className="flex w-full relative">
            <div
              className={twMerge(
                "flex w-full absolute z-0 opacity-0 transition-all invisible",
                viewMode === "gallery" && "opacity-100 visible",
              )}
            >
              <MemoriesGalleryView albumId={album.id} />
            </div>

            <div
              className={twMerge(
                "flex w-full absolute z-1 opacity-0 transition-all invisible",
                viewMode === "map" && "opacity-100 visible",
              )}
            >
              {renderMaps && (
                <MemoriesMapView
                  selectedMemory={selectedMemory}
                  onMove={() => setSelectedMemory(null)}
                />
              )}
            </div>
          </div>
          <div className="flex w-full flex-col min-w-72 md:w-1/5 gap-4">
            <ParticipantsList
              albumId={album.id}
              isAlbumShared={album.isShared}
              participantsIds={album.participants.map((p) => p.userId)}
              shouldShowControls={
                isLoaded ? user?.id === album.authorId : false
              }
            />
            <MemoriesTimeline
              selectedMemory={selectedMemory}
              onSelectMemory={(memory) =>
                viewMode == "map" && setSelectedMemory(memory)
              }
            />
          </div>
        </div>
      </>
    </AlbumMemoriesContext.Provider>
  );
}
