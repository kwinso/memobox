"use client";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { createContext, useContext } from "react";

interface IMemoriesViewModeContext {
  mode: "gallery" | "map";
  setMode: (mode: "gallery" | "map") => void;
}

export const MemoriesViewModeContext = createContext({
  mode: "gallery",
  setMode: (mode: "gallery" | "map") => {},
});

export default function MemoriesViewSelector() {
  const { mode, setMode } = useContext(MemoriesViewModeContext);

  return (
    <Tabs
      fullWidth
      className="md:w-fit"
      aria-label="View Mode"
      selectedKey={mode}
      onSelectionChange={setMode as any}
    >
      <Tab key="gallery" title="gallery"></Tab>
      <Tab key="map" title="map"></Tab>
    </Tabs>
  );
}
