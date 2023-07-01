"use client"

import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
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
  const {setActiveId} = usePlayer();


  // Iniciar la reproducción
  const onClickHandler = () => {
    // Pedir autenticación si no está logueado
    if (!user) {
      authModal.onOpenChange(true);
      return null;
    };

    setActiveId(song.id)
  }

  return (
    <button
      className="flex items-center gap-3 w-full p-2 rounded-md cursor-pointer hover:bg-neutral-800/50"
      onClick={onClickHandler}
    >
      <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
      </div>

      <div className="flex flex-col justify-center items-start overflow-hidden text-left">
        <p className="w-full text-white truncate">{song.title}</p>
        <p className="w-full text-sm text-neutral-400 truncate">{song.author}</p>
      </div>
    </button>
  )
};

export default SongLibraryItem;