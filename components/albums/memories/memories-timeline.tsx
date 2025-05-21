import { Link } from "@heroui/react";
import { twMerge } from "tailwind-merge";
import { ImageIcon } from "lucide-react";
import { useContext, useMemo } from "react";

import { AlbumMemoriesContext } from "../album-view";

import { Memory, MemoryWithUploads } from "@/db/types";

interface MemoryListProps {
  selectedMemory: Memory | null;
  onSelectMemory: (memory: MemoryWithUploads) => void;
}

// TODO: Add collapse for mobile devices
export default function MemoriesTimeline({
  selectedMemory,
  onSelectMemory,
}: MemoryListProps) {
  const { mode, memories } = useContext(AlbumMemoriesContext);
  const timelineMemories = useMemo(() => {
    if (mode === "map") {
      return memories.filter((memory) => memory.latitude && memory.longitude);
    }

    return memories;
  }, [mode, memories]);

  return (
    <div className="bg-default-100 flex flex-col gap-4 h-fit border-2 border-default-200 p-4 rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">timeline</h3>
      </div>
      {timelineMemories.length === 0 && (
        <span className="text-sm text-default-500">
          timeline shows your memories from a bird&apos;s eye view. you can add
          new memories by either on a map or by pressing &quot;add&quot; button
          in the gallery view
        </span>
      )}

      {timelineMemories.map((memory) => (
        <Link
          key={memory.id}
          className={twMerge(
            "flex flex-col gap-2 items-start group text-default-500 border-l-2 pl-2 cursor-pointer transition-all hover:scale-105 group-hover:border-primary-200",
            selectedMemory?.id === memory.id
              ? "scale-105 border-primary-200 text-primary-500"
              : "",
          )}
          onClick={() => onSelectMemory(memory)}
        >
          <p className="text-sm font-bold transition-all group-hover:text-primary-500">
            {memory.caption}
          </p>
          <div className="flex items-center gap-2 text-xs transition-all group-hover:text-primary-500">
            <ImageIcon size={12} />
            {memory.uploads.length}{" "}
            {memory.uploads.length > 1 ? "images" : "image"}
          </div>
        </Link>
      ))}
    </div>
  );
}
