import { currentUser } from "@clerk/nextjs/server";
import { Spacer } from "@heroui/react";
import { BoxIcon } from "lucide-react";

import AlbumListItem from "@/components/albums/album-list-item";
import CreateAlbumForm from "@/components/albums/create-album-form";
import { getUserAlbums } from "@/db/queries/albums";

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
      <div className="flex w-full md:w-1/2 flex-col gap-4">
        <div className="flex w-full items-center justify-between h-6">
          <h5 className="text-xl font-bold">your albums</h5>
          <CreateAlbumForm />
        </div>

        {albums.length > 0 ? (
          <div className="flex flex-col w-full gap-4">
            {albums.map((album) => (
              <AlbumListItem key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <span className="text-sm text-default-500">
            you have no albums yet, create one using a button above.
          </span>
        )}
      </div>
    </section>
  );
}
