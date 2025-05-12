import { Link } from "@heroui/react";

interface MemoryListProps {
  memories: any[];
}

export default function MemoriesTimeline({ memories }: MemoryListProps) {
  return (
    <div className="bg-default-100 flex flex-col gap-4 h-fit border-2 border-default-200 p-4 rounded-xl min-w-72 w-1/5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">timeline</h3>
      </div>
      {memories.length === 0 && (
        <span className="text-sm text-default-500">
          timeline shows your memories from a bird's eye view. you can add new
          memories by either on a map or by pressing "add" button in the gallery
          view
        </span>
      )}

      {memories.map((memory) => (
        <Link
          key={memory.id}
          className="flex gap-2 items-center group border-l-2 pl-2 cursor-pointer transition-all hover:scale-105 hover:border-primary-200"
        >
          <p className="text-sm text-default-500 group-hover:text-primary-500 transition-all">
            {memory.caption}
          </p>
        </Link>
      ))}
    </div>
  );
}
