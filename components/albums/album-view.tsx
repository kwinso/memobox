"use client";
import { Album, AlbumWithMemories } from "@/db/types";
import AlbumPageHeader from "./album-page-header";
import MemoriesTimeline from "./memories/memories-timeline";
import { useState } from "react";
import { MemoriesViewModeContext } from "./memories-view-selector";
import MemoriesGalleryView from "./memories/memories-gallery-view";
import { twMerge } from "tailwind-merge";

interface AlbumParams {
  album: AlbumWithMemories;
}

export default function AlbumView({ album }: AlbumParams) {
  const [viewMode, setViewMode] = useState<"gallery" | "map">("gallery");

  return (
    <MemoriesViewModeContext.Provider
      value={{ mode: viewMode, setMode: setViewMode }}
    >
      <div>
        <AlbumPageHeader title={album.title} />

        <div className="flex justify-between gap-4">
          <div className="flex w-full relative">
            <div
              className={twMerge(
                "flex w-full  absolutez-0 opacity-0 transition-all invisible",
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
              Hello
              {/* <MemoriesMapView /> */}
            </div>
          </div>
          <MemoriesTimeline memories={album.memories} />
        </div>
      </div>
    </MemoriesViewModeContext.Provider>
  );
}
