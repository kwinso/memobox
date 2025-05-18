"use client";
import { Tabs, Tab } from "@heroui/react";
import { useContext } from "react";

import { AlbumMemoriesContext } from "./album-view";

export default function MemoriesViewSelector() {
  const { mode, setMode } = useContext(AlbumMemoriesContext);

  return (
    <Tabs
      fullWidth
      aria-label="View Mode"
      className="md:w-fit"
      selectedKey={mode}
      onSelectionChange={setMode as any}
    >
      <Tab key="gallery" title="gallery" />
      <Tab key="map" title="map" />
    </Tabs>
  );
}
