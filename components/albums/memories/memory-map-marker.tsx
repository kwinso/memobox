import { LngLatBounds, Marker } from "react-map-gl/mapbox";
import {
  Card,
  CardHeader,
  Chip,
  CardFooter,
  Image,
  useDisclosure,
} from "@heroui/react";
import { twMerge } from "tailwind-merge";
import { BoxIcon, ImageIcon } from "lucide-react";

import MemoryDrawer from "./memory-drawer";

import { MemoryWithUploads } from "@/db/types";

interface MemoryMapMarkerProps {
  memory: MemoryWithUploads;
  mapZoom: number;
  viewBounds: LngLatBounds | null;
}

export default function MemoryMapMarker({
  memory,
  mapZoom,
  viewBounds,
}: MemoryMapMarkerProps) {
  const { isOpen, onOpenChange } = useDisclosure();

  if (
    viewBounds &&
    !viewBounds.contains([memory.longitude!, memory.latitude!])
  ) {
    return null;
  }

  return (
    <>
      <Marker
        className="flex justify-center items-center relative cursor-pointer"
        latitude={memory.latitude!}
        longitude={memory.longitude!}
        onClick={onOpenChange}
      >
        <MemoryDrawer
          initialState={{ memory, uploads: memory.uploads }}
          isOpen={isOpen}
          onClose={onOpenChange}
        />

        <div className="w-4 h-4 rounded-full bg-primary-500 absolute" />
        <Card
          isFooterBlurred
          className={twMerge(
            "hover:scale-105 h-52 w-52 border-2 border-transparent hover:border-primary-200 box-content scale-0 transition-all",
            mapZoom > 12 && "scale-100",
          )}
          radius="lg"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-center">
            <Chip
              className="bg-black/10 backdrop-blur backdrop-saturate-150 cursor-pointer border-white/20 border-1"
              size="sm"
            >
              <div className="flex gap-2 items-center text-white/80">
                <ImageIcon size={12} />
                {memory.uploads.length}{" "}
                {memory.uploads.length > 1 ? "images" : "image"}
              </div>
            </Chip>
          </CardHeader>
          {memory.uploads.length > 0 ? (
            <Image
              removeWrapper
              alt={memory.caption}
              className="z-0 w-full object-cover max-h-52"
              src={memory.uploads[0].uploadUrl}
            />
          ) : (
            <BoxIcon className="m-auto" size={32} />
          )}
          <CardFooter className="flex-col items-start bg-black/10  before:bg-black/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-sm text-white/80">{memory.caption}</p>
          </CardFooter>
        </Card>
      </Marker>
    </>
  );
}
