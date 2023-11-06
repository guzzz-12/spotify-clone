"use client"

import Image from "next/image";
import { Tooltip } from "react-tooltip";
import LikeBtn from "../LikeBtn";
import AddToPlaylistBtn from "../AddToPlaylistBtn";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface Props {
  song: Song;
};

const SearchResultItem = ({song}: Props) => {
  const imageUrl = useLoadImage(song);

  const {playList, setActiveId} = usePlayer();
  const isAddedToPlayList = playList.includes(song.id);

  return (
    <div
      className="flex justify-between items-center gap-3 w-full p-2 rounded-md bg-neutral-800/50 cursor-pointer hover:bg-neutral-800"
      onClick={() => setActiveId(song.id)}
    >
      <Tooltip id="playlist-btn" className="z-50" />
      <div className="flex items-center gap-3 w-full">
        <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            className="w-full h-auto object-cover"
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
      <div className="flex justify-center items-center gap-2">
        <LikeBtn songId={song.id} />
        <AddToPlaylistBtn
          song={song}
          iconSize="md"
          path="search"
          isAddedToPlayList={isAddedToPlayList}
        />
      </div>
    </div>
  )
};

export default SearchResultItem;