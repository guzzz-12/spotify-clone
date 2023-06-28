"use client"

import Image from "next/image";
import PlayBtn from "./PlayBtn";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface Props {
  song: Song;
};

const SongItem = (props: Props) => {
  const {song} = props;

  const imageUrl = useLoadImage(song);
  const {setActiveId, setPlayList} = usePlayer();

  const onClickPlayHandler = (songId: number) => {
    setPlayList([]);
    setActiveId(songId);
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center gap-4 p-3 rounded-md bg-neutral-400/5 group overflow-hidden cursor-pointer transition-colors hover:bg-neutral-400/10"
      onClick={() => {}}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/0 transition-colors group-hover:bg-black/60 z-10" />
      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        <Image
          className="object-cover"
          fill
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
        <div
          className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-20"
          onClick={onClickPlayHandler.bind(null, song.id)}
        >
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