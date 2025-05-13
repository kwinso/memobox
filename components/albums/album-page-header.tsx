"use client";
import { Link } from "@heroui/react";
import { ChevronLeftIcon } from "lucide-react";

import MemoriesViewSelector from "./memories-view-selector";

interface PageHeaderProps {
  title: string;
}

export default function AlbumPageHeader({ title }: PageHeaderProps) {
  return (
    <div className="mb-4 flex w-full flex-col">
      <Link className="flex items-center gap-2" href="/">
        <ChevronLeftIcon size={12} />
        back
      </Link>
      <div className="flex w-full flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <MemoriesViewSelector />
      </div>
    </div>
  );
}
