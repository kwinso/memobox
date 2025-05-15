import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DatePicker,
  Input,
  Form,
} from "@heroui/react";
import { useState } from "react";
import { getLocalTimeZone, CalendarDate, today } from "@internationalized/date";
import { useRouter } from "next/navigation";

import MemoryUploadDropzone from "./memory-upload-dropzone";
import MemoryUploadCard from "./memory-upload-card";

import { Memory, MemoryInsertData, MemoryUpload } from "@/db/types";
import { createMemory } from "@/db/queries/memories";
import { dateToCalendarDate } from "@/util/date";

interface MemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialState: {
    memory: Partial<Memory>;
    uploads: MemoryUpload[];
  };
}

type memoryState = Omit<MemoryInsertData, "authorId" | "date"> & {
  date: CalendarDate;
};

export default function MemoryDrawer({
  isOpen,
  onClose,
  initialState,
}: MemoryDrawerProps) {
  const router = useRouter();
  const [uploads, setUploads] = useState<MemoryUpload[]>(initialState.uploads);
  const [isCreating, setIsCreating] = useState(false);
  const [memory, setMemory] = useState<memoryState>({
    id: initialState.memory.id,
    caption: initialState.memory?.caption ?? "",
    longitude: initialState.memory?.longitude,
    latitude: initialState.memory?.latitude,
    albumId: initialState.memory?.albumId ?? "",
    date:
      initialState.memory?.date != null
        ? dateToCalendarDate(initialState.memory.date)
        : today(getLocalTimeZone()),
  });

  async function onSubmit() {
    setIsCreating(true);
    const memoryData = await createMemory({
      ...memory,
      date: memory.date.toDate(getLocalTimeZone()),
    });

    setMemory({ ...memoryData, date: dateToCalendarDate(memoryData.date) });
  }

  return (
    <Drawer
      isOpen={isOpen}
      size="2xl"
      onClose={() => {
        // FIXME: Dirty hack to make sure data is updated
        router.refresh();
        onClose();
      }}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              {memory.caption || "create memory"}
            </DrawerHeader>
            <DrawerBody>
              <Form onSubmit={onSubmit}>
                <Input
                  isRequired
                  label="caption"
                  labelPlacement="outside"
                  placeholder="enter memory caption"
                  validate={(value) => {
                    if (value.length < 0) {
                      return "memory caption is required";
                    }
                  }}
                  value={memory.caption}
                  variant="bordered"
                  onValueChange={(value) =>
                    setMemory({ ...memory, caption: value })
                  }
                />
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={memory.date}
                  label="date"
                  labelPlacement="outside"
                  value={memory.date}
                  variant="bordered"
                  onChange={(date) => setMemory({ ...memory, date: date! })}
                />

                <h3 className="text-lg mt-4">photos / videos</h3>
                {memory.id ? (
                  <>
                    <MemoryUploadDropzone
                      memoryId={memory.id}
                      onUploadComplete={(addedUploads) =>
                        setUploads([...addedUploads, ...uploads])
                      }
                    />
                  </>
                ) : (
                  <>
                    <span className="text-sm text-default-500">
                      you can upload photos after you create the memory
                    </span>
                    <Button
                      fullWidth
                      className="mt-4"
                      color="primary"
                      isLoading={isCreating}
                      type="submit"
                    >
                      {isCreating ? "creating..." : "create"}
                    </Button>
                  </>
                )}
              </Form>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {uploads.map((upload) => (
                  <MemoryUploadCard key={upload.id} upload={upload} />
                ))}
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
