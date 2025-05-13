"use client";
import { Tabs, Tab } from "@heroui/react";
import { createContext, useContext } from "react";

export const MemoriesViewModeContext = createContext({
  mode: "gallery",
  setMode: (_: "gallery" | "map") => {},
});

export default function MemoriesViewSelector() {
  const { mode, setMode } = useContext(MemoriesViewModeContext);

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
