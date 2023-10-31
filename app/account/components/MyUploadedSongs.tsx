"use client"

import { useState } from "react";
import MyUploadedSongItem from "./MyUploadedSongItem";
import DeleteSongModal from "./DeleteSongModal";
import { Song } from "@/types";

interface Props {
  userSongs: Song[]
}

const MyUploadedSongs = ({userSongs}: Props) => {
  const [deletedSongId, setDeletedSongId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <section className="mb-7 px-4">
      <DeleteSongModal
        isOpen={isDeleteModalOpen}
        songId={deletedSongId}
        setIsOpen={setIsDeleteModalOpen}
      />

      <h2 className="text-xl">Your Uploaded Songs</h2>

      {userSongs.length === 0 &&
        <p className="mt-4 text-neutral-400">
          You haven't uploaded songs yet
        </p>
      }

      {userSongs.length > 0 && 
        <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
          {userSongs.map((song) => {
            return (
              <MyUploadedSongItem
                key={song.id}
                song={song}
                setDeleteModalOpen={setIsDeleteModalOpen}
                setDeletedSongId={setDeletedSongId}
              />
            )
          })}
        </div>
      }
    </section>
  )
}

export default MyUploadedSongs;