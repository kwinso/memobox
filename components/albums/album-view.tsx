"use client";
import { createContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import AlbumPageHeader from "./album-page-header";
import MemoriesTimeline from "./memories/memories-timeline";
import MemoriesGalleryView from "./memories/memories-gallery-view";
import MemoriesMapView from "./memories/memories-map-view";

import { AlbumWithMemories, MemoryUpload, MemoryWithUploads } from "@/db/types";

interface AlbumParams {
  album: AlbumWithMemories;
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
          <MemoriesTimeline
            selectedMemory={selectedMemory}
            onSelectMemory={(memory) =>
              viewMode == "map" && setSelectedMemory(memory)
            }
          />
        </div>
      </>
    </AlbumMemoriesContext.Provider>
  );
}
