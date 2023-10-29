"use client"

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { TbArrowsMaximize } from "react-icons/tb";
import { BsDash } from "react-icons/bs";
import PlayerContent from "./PlayerContent";
import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";

const Player = () => {
  /**
   * Volumen inicial del reproductor.
   * El valor persiste entre renders para iniciar
   * la siguiente canción en el mismo volumen.
   * */
  const initialVolumeRef = useRef<number[]>([50]);

  const {activeId, resetPlayer} = usePlayer();
  const {songData, songUrl, isLoading} = useGetSongById(activeId);

  const [isMinimized, setIsMinimized] = useState(false);

  /**
   * Actualizar el volumen inicial del reproductor
   * cuando el usuario actualice el volumen.
   * */
  const updateInitialVolume = (vol: number[]) => {
    initialVolumeRef.current = vol;
  };

  return (
    <AnimatePresence>
      {activeId &&
        <motion.div
          className="fixed bottom-0 w-full px-4 py-2 border-t-2 border-green-400 bg-neutral-200 z-[900]"
          initial={{y: "100%", opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: "100%", opacity: 0}}
        >
          <div className="absolute -top-[2px] right-3 flex justify-between items-center gap-0 -translate-y-[100%] bg-neutral-200">
            <button
              className="px-2 py-1 text-neutral-900 rounded-full"
              onClick={() => setIsMinimized((prev) => !prev)}
            >
              {isMinimized &&
                <TbArrowsMaximize size={20} />
              }
              {!isMinimized &&
                <BsDash size={20} />
              }
            </button>
            
            <button
              className="px-2 py-1 text-neutral-900 rounded-full"
              onClick={() => resetPlayer()}
            >
              <FaTimes size={20} />
            </button>
          </div>

          <PlayerContent
            key={songUrl}
            song={songData}
            songUrl={songUrl}
            initialVolume={initialVolumeRef.current}
            updateInitialVolume={updateInitialVolume}
            isLoading={isLoading}
            isMinimized={isMinimized}
          />
        </motion.div>
      }
    </AnimatePresence>
  )
};

export default Player;