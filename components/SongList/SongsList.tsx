"use client"

import { Song } from "@/types";
import SongItem from "./SongItem";

interface Props {
  songs: Song[];
};

const SongsList = ({songs}: Props) => {
  if (songs.length === 0) {
    return (
      <h2 className="mt-4 text-neutral-400">
        No songs available
      </h2>
    );
  };

  return (
    <section className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
      {songs.map((song) => {
        return (
          <SongItem
            key={song.id}
            song={song}
            onClick={() => {}}
          />
        )
      })}
    </section>
  )
};

export default SongsList;