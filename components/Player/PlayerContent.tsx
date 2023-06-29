"use client"

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PlayerControls from "./PlayerControls";
import LikeBtn from "../LikeBtn";
import SongLibraryItem from "../SongLibraryItem";
import PlayerVolumeSlider from "./PlayerVolumeSlider";
import PlayerTimeSlider from "./PlayerTimeSlider";
import SongLibraryItemSkeleton from "../SongLibraryItemSkeleton";
import usePlayer from "@/hooks/usePlayer";
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

  const {activeId} = usePlayer();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);


  // Destruir el player anterior al cambiar la canción seleccionada
  // para evitar que la canción anterior siga sonando antes de que
  // cargue la data de la nueva canción.
  useEffect(() => {
    return () => {
      audioPlayerRef.current = null;
    }
  }, [activeId, audioPlayerRef]);


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
                <SongLibraryItem song={song} />
                <LikeBtn songId={song.id} />
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