"use client"

import { useRouter } from "next/navigation";
import PlayBtn from "./PlayBtn";
import AddToPlaylistBtn from "../AddToPlaylistBtn";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useCurrentSession from "@/hooks/useCurrentSession";
import { Song } from "@/types";

interface Props {
  song: Song;
};

const SongItem = (props: Props) => {
  const {song} = props;

  const router = useRouter();

  const session = useCurrentSession(state => state.session);

  const imageUrl = useLoadImage(song);
  const {playList, setActiveId, setPlayList} = usePlayer();
  const isAddedToPlayList = playList.includes(song.id);

  const onClickPlayHandler = (songId: number) => {
    // Pedir autenticación si no está logueado
    if (!session) {
      return router.replace("/signin");
    };
    
    setPlayList([songId]);
    setActiveId(songId);
  };


  return (
    <div
      className="relative flex flex-col justify-center items-center gap-4 p-3 rounded-md bg-neutral-400/5 group overflow-hidden cursor-pointer transition-colors hover:bg-neutral-400/10"
      onClick={onClickPlayHandler.bind(null, song.id)}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/0 transition-colors group-hover:bg-black/60 z-10" />
      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        <img
          className="block w-full h-full object-cover"
          src={imageUrl || "/images/song-default-image.webp"}
          alt={`${song.title} image`}
        />
        <div className="absolute top-[50%] left-[50%] flex justify-center items-center gap-2 -translate-x-[50%] -translate-y-[50%] z-20">
          <PlayBtn />
          <AddToPlaylistBtn
            className="p-4 rounded-full drop-shadow-md opacity-0 text-black bg-green-500 transition-all hover:scale-110 group-hover:opacity-100"
            song={song}
            iconSize="sm"
            path="homepage"
            isAddedToPlayList={isAddedToPlayList}
          />
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