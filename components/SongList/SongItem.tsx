"use client"

import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import PlayBtn from "./PlayBtn";

interface Props {
  song: Song;
  onClick: (id: number) => void;
};

const SongItem = (props: Props) => {
  const {song, onClick} = props;

  const imageUrl = useLoadImage(song);

  return (
    <div
      className="relative flex flex-col justify-center items-center gap-4 p-3 rounded-md bg-neutral-400/5 group overflow-hidden cursor-pointer transition-colors hover:bg-neutral-400/10"
      onClick={onClick.bind(null, song.id)}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/0 transition-colors group-hover:bg-black/60 z-10" />
      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-20">
          <PlayBtn />
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
};

export default SongItem;