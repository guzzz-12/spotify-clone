"use client"

import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";

interface Props {
  song: Song;
  onClick: () => void;
};

const SongLibraryItem = ({song, onClick}: Props) => {
  const imageUrl = useLoadImage(song);

  return (
    <div
      className="flex items-center gap-3 w-full p-2 rounded-md cursor-pointer hover:bg-neutral-800/50"
      onClick={onClick.bind(song.id)}
    >
      <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
      </div>

      <div className="flex flex-col justify-center items-start overflow-hidden">
        <p className="w-full text-white truncate">{song.title}</p>
        <p className="w-full text-sm text-neutral-400 truncate">{song.author}</p>
      </div>
    </div>
  )
};

export default SongLibraryItem;