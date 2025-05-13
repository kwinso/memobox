"use client";
import { Album, AlbumWithMemories, Memory } from "@/db/types";
import AlbumPageHeader from "./album-page-header";
import MemoriesTimeline from "./memories/memories-timeline";
import { useEffect, useState } from "react";
import { MemoriesViewModeContext } from "./memories-view-selector";
import MemoriesGalleryView from "./memories/memories-gallery-view";
import { twMerge } from "tailwind-merge";
import MemoriesMapView from "./memories/memories-map-view";
import { Button } from "@heroui/button";

interface AlbumParams {
  album: AlbumWithMemories;
}

export default function AlbumView({ album }: AlbumParams) {
  const [viewMode, setViewMode] = useState<"gallery" | "map">("gallery");
  const [renderMaps, setRenderMaps] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Make sure maps are only loaded once when the user actually wants to see them
  useEffect(() => {
    if (viewMode === "map" && !renderMaps) {
      setRenderMaps(true);
    }
  }, [viewMode]);

  return (
    <MemoriesViewModeContext.Provider
      value={{
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
                viewMode === "gallery" && "opacity-100 visible"
              )}
            >
              <MemoriesGalleryView memories={album.memories} />
            </div>

            <div
              className={twMerge(
                "flex w-full absolute z-1 opacity-0 transition-all invisible",
                viewMode === "map" && "opacity-100 visible"
              )}
            >
              {renderMaps && (
                <MemoriesMapView
                  onMove={() => setSelectedMemory(null)}
                  selectedMemory={selectedMemory}
                  memories={album.memories}
                />
              )}
            </div>
          </div>
          <MemoriesTimeline
            selectedMemory={selectedMemory}
            onSelectMemory={(memory) =>
              viewMode == "map" && setSelectedMemory(memory)
            }
            memories={album.memories}
          />
        </div>
      </>
    </MemoriesViewModeContext.Provider>
  );
}
