import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { getAlbumJoinInfo, isParticipant } from "@/db/queries/albums";
import JoinAlbumButton from "@/components/albums/join-album-button";

interface JoinAlbumPageProps {
  params: Promise<{ albumId: string }>;
}

export default async function JoinAlbumPage({ params }: JoinAlbumPageProps) {
  const { albumId } = await params;
  const album = await getAlbumJoinInfo(albumId);

  if (!album || !album.isShared) {
    return notFound();
  }

  const user = await auth();

  if (await isParticipant(albumId, user.userId!)) {
    return redirect(`/albums/${albumId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-3xl font-bold">{album.title}</h1>
      <p className="text-center w-[50%]">
        you have been invited to join the album <b>{album.title}.</b>
        <br />
        press a button below to join.
      </p>

      <JoinAlbumButton albumId={albumId} userId={user.userId!} />
    </div>
  );
}
