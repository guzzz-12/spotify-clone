"use client"

import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { Tooltip } from "react-tooltip";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import useAuthModal from "@/hooks/useAuthModal";

interface Props {
  song: Song;
};

const SongLibraryItem = ({song}: Props) => {
  const imageUrl = useLoadImage(song);

  const user = useUser();
  const authModal = useAuthModal();
  const {setActiveId, playList, setPlayList, addToPlayList, removeFromPlayList} = usePlayer();

  // Iniciar la reproducción
  const onClickHandler = () => {
    // Pedir autenticación si no está logueado
    if (!user) {
      authModal.onOpenChange(true);
      return null;
    };

    setPlayList([]);
    setActiveId(song.id);
  }

  const isAddedToPlayList = playList.includes(song.id);

  return (
    <button
      className="flex items-center gap-0 w-full p-2 rounded-md border border-neutral-800 cursor-pointer hover:bg-neutral-800/50"
      onClick={onClickHandler}
    >
      <Tooltip id="playlist-btn" className="z-50" />

      <div className="relative w-12 h-12 mr-2 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
      </div>

      <div className="flex flex-col justify-center items-start flex-grow text-left overflow-hidden">
        <p className="w-full text-white truncate">{song.title}</p>
        <p className="w-full text-sm text-neutral-400 truncate">{song.author}</p>
      </div>

      <button
        className="flex justify-center items-center w-7 h-7 p-[3px] self-start flex-shrink-0 rounded-full hover:bg-slate-600/60 transition-colors"
        data-tooltip-id="playlist-btn"
        data-tooltip-content={isAddedToPlayList ? "Remove from playlist" : "Add to playlist"}
        onClick={(e) => {
          e.stopPropagation();
          if (!isAddedToPlayList) {
            addToPlayList(song.id);
          } else {
            removeFromPlayList(song.id);
          }
        }}
      >
        {isAddedToPlayList && <FaTimes className="w-4 h-4 text-neutral-400" />}
        {!isAddedToPlayList && <MdOutlinePlaylistAdd className="w-6 h-6 text-neutral-400" />}
      </button>
    </button>
  )
};

export default SongLibraryItem;