"use client"

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
import { Song } from "@/types";
import usePlaylistModal from "@/hooks/usePlaylistModal";

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
        className="flex justify-between items-center h-full overflow-hidden"
        animate={{height: isMinimized ? 0 : "auto"}}
      >
        <div className="flex justify-start w-full h-full">
          <div className="flex items-center gap-4 flex-shrink-0 min-w-[150px]">
            {isLoading && !song && <SongLibraryItemSkeleton />}

            {song &&
              <>
                <div className="flex justify-start items-center gap-2 px-2 py-1 border border-neutral-400 rounded-md bg-white">
                  <Tooltip id="open-playlist" />

                  <Image
                    className="block border border-neutral-200 rounded-sm"
                    width={50}
                    height={50}
                    src={imageUrl || "/images/song-default-image.webp"}
                    alt={`${song.title} image`}
                  />
                  <div className="flex flex-col justify-start items-stretch gap-0">
                    <p className="text-left text-neutral-900 font-medium">
                      {song.title}
                    </p>
                    <p className="text-left text-xs text-neutral-700">
                      {song.author}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center items-center p-1 rounded-full bg-white shadow-md">
                  <LikeBtn songId={song.id} />
                </div>

                <button
                  className="flex justify-center items-center p-1 rounded-full bg-white shadow-md"
                  data-tooltip-id="open-playlist"
                  data-tooltip-content="Open Playlist"
                  onClick={() => openPlaylist(true)}
                >
                  <MdPlaylistPlay className="text-green-400" size={30} />
                </button>
              </>
            }
          </div>
        </div>
        
        <div className="w-full">
          <PlayerControls
            isPaused={isPaused}
            isPlaying={isPlaying}
            isStopped={isStopped}
            setIsPaused={(bool: boolean) => setIsPaused(bool)}
            setIsPlaying={(bool: boolean) => setIsPlaying(bool)}
            setIsStopped={(bool: boolean) => setIsStopped(bool)}
            playerRef={audioPlayerRef}
          />
        </div>
        
        <div className="w-full">
          <PlayerVolumeSlider
            initialVolume={initialVolume}
            updateInitialVolume={updateInitialVolume}
            playerRef={audioPlayerRef}
          />
        </div>

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