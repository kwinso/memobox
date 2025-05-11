import { getAlbumById } from "@/db/queries/albums";
import { notFound } from "next/navigation";

interface AlbumParams {
  params: Promise<{ albumId: string }>;
}

export default async function Album({ params }: AlbumParams) {
  const { albumId } = await params;
  const album = await getAlbumById(albumId);

  if (!album) {
    return notFound();
  }

  return <div>{album.title}</div>;
}
