"use client"

import { Dispatch, MouseEvent, SetStateAction } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { BiEdit, BiTrash } from "react-icons/bi";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface Props {
  song: Song;
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
  setDeletedSongId: Dispatch<SetStateAction<number | null>>;
}

const MyUploadedSongItem = ({song, setDeleteModalOpen, setDeletedSongId}: Props) => {
  const imageUrl = useLoadImage(song);
  const {setActiveId, resetPlayer} = usePlayer();

  const onEditSonHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    resetPlayer();
  }

  /** Abrir el modal para confirmar la eliminación de la canción */
  const onDeleteSongHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
    setDeletedSongId(song.id);
    resetPlayer();
  }

  return (
    <div
      className="relative flex flex-col justify-center items-center gap-4 p-3 rounded-md bg-black group overflow-hidden cursor-pointer transition-colors hover:bg-neutral-400/10"
      onClick={() => setActiveId(song.id)}
      >
      <Tooltip id={`edit-song-${song.id}-tooltip`} className="z-50" />
      <Tooltip id={`delete-song-${song.id}-tooltip`} className="z-50" />

      {/* Overlay del item de la canción */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/0 pointer-events-none transition-colors group-hover:bg-black/60 z-10" />

      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
          <button
            className="flex justify-center items-center w-9 h-9 rounded-full bg-green-900/50 hover:bg-green-900 transition-colors"
            data-tooltip-id={`edit-song-${song.id}-tooltip`}
            data-tooltip-content="Edit Song"
            onClick={onEditSonHandler}
          >
            <BiEdit className="w-6 h-6 text-white" />
          </button>
          <button
            className="flex justify-center items-center w-9 h-9 rounded-full bg-green-900/50 hover:bg-green-900 transition-colors"
            data-tooltip-id={`delete-song-${song.id}-tooltip`}
            data-tooltip-content="Delete Song"
            onClick={onDeleteSongHandler}
          >
            <BiTrash className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 w-full">
        <p className="w-full font-semibold truncate">
          {song.title}
        </p>
        <p className="w-full pb-2 text-sm text-neutral-400 truncate">
          By: {song.author}
        </p>
      </div>
    </div>
  )
}

export default MyUploadedSongItem;