"use client"

import { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
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
          className="fixed bottom-0 w-full min-h-[80px] px-4 py-2 bg-black"
          initial={{y: "100%", opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: "100%", opacity: 0}}
        >
          <button
            className="absolute top-0 right-3 p-2 text-white rounded-full outline-1 focus:outline-white"
            onClick={() => resetPlayer()}
          >
            <FaTimes size={18} />
          </button>
          <PlayerContent
            key={songUrl}
            song={songData}
            songUrl={songUrl}
            initialVolume={initialVolumeRef.current}
            updateInitialVolume={updateInitialVolume}
            isLoading={isLoading}
          />
        </motion.div>
      }
    </AnimatePresence>
  )
};

export default Player;