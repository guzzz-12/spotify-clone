"use client"

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { MdPlaylistPlay } from "react-icons/md";
import PlayerControls from "./PlayerControls";
import LikeBtn from "../LikeBtn";
import PlayerVolumeSlider from "./PlayerVolumeSlider";
import PlayerTimeSlider from "./PlayerTimeSlider";
import SongLibraryItemSkeleton from "../SongLibraryItemSkeleton";
import usePlayer from "@/hooks/usePlayer";
import useLoadImage from "@/hooks/useLoadImage";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import { Song } from "@/types";

interface Props {
  song: Song | null;
  songUrl: string | null;
  initialVolume: number[];
  updateInitialVolume: (vol: number[]) => void;
  isLoading: boolean;
  isMinimized: boolean;
};

const PlayerContent = (props: Props) => {
  const {song, songUrl, initialVolume, updateInitialVolume, isLoading, isMinimized} = props;

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const {activeId, playList, setActiveId} = usePlayer();
  const imageUrl = useLoadImage(song!);
  const {openPlaylist} = usePlaylistModal();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);


  // Destruir el player anterior al cambiar la canción seleccionada
  // para evitar que la canción anterior siga sonando antes de que
  // cargue la data de la nueva canción.
  useEffect(() => {
    // Reproducir la siguiente canción automáticamente si es un playlist
    if (audioPlayerRef.current && playList.length) {
      audioPlayerRef.current.onended = () => {
        const currentIndex = playList.findIndex(el => el === activeId);
        if (currentIndex !== -1 && currentIndex + 1 < playList.length) {
          setActiveId(playList[currentIndex + 1]);
        }
      }
    };

    return () => {
      audioPlayerRef.current = null;
    }
  }, [activeId, playList, audioPlayerRef]);


  return (
    <div className="flex flex-col gap-1 w-full h-full">
      <motion.div
        key="player-controls"
        className="flex justify-between items-center gap-2 max-[550px]:gap-4 flex-wrap w-full h-full"
        animate={{height: isMinimized ? 0 : "auto"}}
      >
        {song &&
          <div className="flex justify-center items-center gap-2 min-[650px]:hidden w-full shrink-0 text-center overflow-hidden">
            <p className="text-base font-semibold text-neutral-900 truncate">
              {song.title}
            </p>
            <span className="text-neutral-900">&ndash;</span>
            <p className="text-base text-neutral-700 truncate">
              {song.author}
            </p>
          </div>
        }

        <div className="hidden min-[650px]:flex items-center gap-4">
          {isLoading && !song && <SongLibraryItemSkeleton />}

          {song &&
            <>
              <div className="flex justify-center items-center gap-2 flex-shrink px-2 py-1 border border-neutral-400 rounded-md bg-white">
                <Tooltip id="open-playlist" />

                <img
                  className="block w-[20px] h-[20px] md:w-[50px] md:h-[50px] border border-neutral-200 rounded-sm"
                  src={imageUrl || "/images/song-default-image.webp"}
                  alt={`${song.title} image`}
                />
                <div className="flex flex-col justify-start items-stretch gap-0 overflow-hidden">
                  <p className="text-left text-sm md:text-base text-neutral-900 font-medium truncate">
                    {song.title}
                  </p>
                  <p className="text-left text-xs text-neutral-700">
                    {song.author}
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:flex justify-center items-center p-1 rounded-full bg-white shadow-md">
                <LikeBtn songId={song.id} />
              </div>

              <button
                className="hidden lg:flex justify-center items-center p-1 rounded-full bg-white shadow-md"
                data-tooltip-id="open-playlist"
                data-tooltip-content="Open Playlist"
                onClick={() => openPlaylist(true)}
              >
                <MdPlaylistPlay className="text-green-400" size={30} />
              </button>
            </>
          }
        </div>
        
        <PlayerControls
          isPaused={isPaused}
          isPlaying={isPlaying}
          isStopped={isStopped}
          setIsPaused={(bool: boolean) => setIsPaused(bool)}
          setIsPlaying={(bool: boolean) => setIsPlaying(bool)}
          setIsStopped={(bool: boolean) => setIsStopped(bool)}
          playerRef={audioPlayerRef}
        />
        
        <PlayerVolumeSlider
          initialVolume={initialVolume}
          updateInitialVolume={updateInitialVolume}
          playerRef={audioPlayerRef}
        />

        {songUrl &&
          <audio
            ref={audioPlayerRef}
            className="hidden"
            preload="metadata"
            controls
            autoPlay
          >
            <source src={songUrl} />
          </audio>
        }
      </motion.div>

      <PlayerTimeSlider playerRef={audioPlayerRef} />
    </div>
  )
};

export default PlayerContent;