import { Button } from "@heroui/button";
import { ApertureIcon, UploadIcon } from "lucide-react";
import MemoriesViewSelector from "../memories-view-selector";
import MemoryCard from "./memory-card";

interface MemoriesGalleryViewProps {
  memories: any[];
}

export default function MemoriesGalleryView({
  memories,
}: MemoriesGalleryViewProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full gap-2 h-fit items-center justify-between">
        <h3 className="text-xl font-bold">memories ({memories.length})</h3>
        <Button
          variant="flat"
          size="sm"
          color="primary"
          startContent={<UploadIcon size={15} />}
        >
          add memory
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </div>
  );
}
