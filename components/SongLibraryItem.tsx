"use client"

import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { twMerge } from "tailwind-merge";
import AddToPlaylistBtn from "./AddToPlaylistBtn";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useAuthModal from "@/hooks/useAuthModal";
import { Song } from "@/types";

interface Props {
  song: Song;
  borderLess?: boolean;
};

const SongLibraryItem = ({song, borderLess}: Props) => {
  const imageUrl = useLoadImage(song);

  const user = useUser();
  const authModal = useAuthModal();
  const {setActiveId, playList, setPlayList} = usePlayer();

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
      className={twMerge("flex items-center gap-0 w-full p-2 cursor-pointer rounded-md  hover:bg-neutral-800/50 overflow-hidden", borderLess ? "border-none" : "border border-neutral-800")}
      onClick={onClickHandler}
    >
      <div className="relative w-12 h-12 mr-2 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
      </div>

      <div className="flex flex-col justify-center items-start mr-1 flex-grow text-left overflow-hidden">
        <p className="w-full text-white truncate">{song.title}</p>
        <p className="w-full text-sm text-neutral-400 truncate">{song.author}</p>
      </div>

      <AddToPlaylistBtn
        className="p-2 text-neutral-300"
        song={song}
        path="sidebar"
        isAddedToPlayList={isAddedToPlayList}
      />
    </button>
  )
};

export default SongLibraryItem;