import { notFound } from "next/navigation";

import AlbumView from "@/components/albums/album-view";
import { getAlbumById } from "@/db/queries/albums";
import { AlbumDetails } from "@/db/types";

interface AlbumParams {
  params: Promise<{ albumId: string }>;
}

// TODO: Could've been better if I don't render everything on the client actually
// But i need the view selector context to be avaiable at the top while it is rendered in the title component,
// which is on another branch of rendering tree. So that's why we need to render everything on the client...
export default async function Album({ params }: AlbumParams) {
  const { albumId } = await params;

  let album: AlbumDetails | undefined;

  try {
    album = await getAlbumById(albumId);
  } catch {
    return notFound();
  }

  if (!album) {
    return notFound();
  }

  return <AlbumView album={album} />;
}
