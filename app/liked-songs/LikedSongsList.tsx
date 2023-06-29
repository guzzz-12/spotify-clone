"use client"

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import SongLibraryItem from "@/components/SongLibraryItem";
import LikeBtn from "@/components/LikeBtn";
import { UserContext } from "@/context/UserProvider";
import { Song } from "@/types";

interface Props {
  likedSongs: Song[]
};

const LikedSongsList = ({likedSongs}: Props) => {
  const {replace} = useRouter();

  const {user, isLoadingUser} = useContext(UserContext);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      replace("/")
    };

  }, [isLoadingUser, user]);

  if (likedSongs.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full px-6">
        <p className="text-neutral-400">
          You don't have liked songs
        </p>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      {likedSongs.map(song => {
        return (
          <div
            key={song.id}
            className="flex items-center w-full gap-4"
          >
            <div className="relative flex-grow">
              <SongLibraryItem song={song}/>
              <div className="absolute right-3 top-[50%] -translate-y-[50%]">
                <LikeBtn songId={song.id}/>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
};

export default LikedSongsList;