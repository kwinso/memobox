import { Link } from "@heroui/react";
import { intlFormat } from "date-fns";
import { twMerge } from "tailwind-merge";

import { Memory } from "@/db/types";

interface MemoryListProps {
  memories: any[];
  selectedMemory: Memory | null;
  onSelectMemory: (memory: Memory) => void;
}

// TODO: Add collaps for mobile devices
export default function MemoriesTimeline({
  memories,
  selectedMemory,
  onSelectMemory,
}: MemoryListProps) {
  return (
    <div className="bg-default-100 flex flex-col gap-4 h-fit border-2 border-default-200 p-4 rounded-xl min-w-72 md:w-1/5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">timeline</h3>
      </div>
      {memories.length === 0 && (
        <span className="text-sm text-default-500">
          timeline shows your memories from a bird&apos;s eye view. you can add
          new memories by either on a map or by pressing &quot;add&quot; button
          in the gallery view
        </span>
      )}

      {memories.map((memory) => (
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
          <span className="text-xs transition-all group-hover:text-primary-500">
            {intlFormat(memory.date, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </Link>
      ))}
    </div>
  );
}
