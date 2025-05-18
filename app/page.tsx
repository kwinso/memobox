import { currentUser } from "@clerk/nextjs/server";
import { Spacer } from "@heroui/react";
import { BoxIcon } from "lucide-react";

import { getUserAlbums } from "@/db/queries/albums";
import AlbumsList from "@/components/albums/albums-list";

// TODO: Scroll pagination
export default async function Home() {
  const user = await currentUser();
  const albums = await getUserAlbums(user!.id);

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <BoxIcon size={32} />
        <h3 className="text-3xl font-bold">memobox.</h3>
      </div>
      <span className="text-sm text-default-500">
        a place to store your group memories.
      </span>

      <Spacer x={2} />
      <AlbumsList initialAlbums={albums} />
    </section>
  );
}
