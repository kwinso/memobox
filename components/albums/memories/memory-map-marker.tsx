import { LngLatBounds, Marker } from "react-map-gl/mapbox";
import {
  Card,
  CardHeader,
  Tooltip,
  Chip,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { intlFormat, formatDistance } from "date-fns";
import { ClockIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import ViewMemoryModal from "./view-memory-modal";

import { Memory } from "@/db/types";

interface MemoryMapMarkerProps {
  memory: Memory;
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
        <Modal isOpen={isOpen} size="3xl" onOpenChange={onOpenChange}>
          <ModalContent>
            {() => <ViewMemoryModal memory={memory} />}
          </ModalContent>
        </Modal>

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
            <Tooltip
              content={intlFormat(memory.date, {
                year: "numeric",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
              })}
              placement="bottom"
            >
              <Chip
                className="bg-black/10 backdrop-blur backdrop-saturate-150 cursor-pointer border-white/20 border-1"
                size="sm"
              >
                <div className="flex gap-2 items-center text-white/80">
                  <ClockIcon size={12} />
                  {formatDistance(memory.date, new Date(), { addSuffix: true })}
                </div>
              </Chip>
            </Tooltip>
          </CardHeader>
          <Image
            alt={memory.caption}
            className="z-0 object-cover h-52 w-52"
            src={memory.uploadUrl}
          />
          <CardFooter className="flex-col items-start bg-black/10  before:bg-black/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-sm text-white/80">{memory.caption}</p>
          </CardFooter>
        </Card>
      </Marker>
    </>
  );
}
