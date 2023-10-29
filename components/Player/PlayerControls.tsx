"use client"

import { MutableRefObject, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Tooltip } from "react-tooltip";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { AiFillStepForward, AiFillStepBackward } from "react-icons/ai";
import usePlayer from "@/hooks/usePlayer";

interface Props {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsStopped: (isStopped: boolean) => void;
  playerRef: MutableRefObject<HTMLAudioElement | null>;
};

const PlayerControls = (props: Props) => {
  const {isPaused, isPlaying, isStopped, setIsPaused, setIsPlaying, setIsStopped} = props;

  const [isFirstSong, setIsFirstSong] = useState(true);
  const [isLastSong, setIsLastSong] = useState(false);

  const {activeId, playList, setActiveId} = usePlayer();
  const isPlaylist = playList.length > 1;

  
  // Verificar si es la primera o la última canción
  useEffect(() => {
    if (isPlaylist) {
      const currentSongIndex = playList.findIndex(el => el === activeId);
  
      setIsFirstSong(currentSongIndex === 0);
      setIsLastSong(currentSongIndex === playList.length - 1);      
    };
  }, [activeId, playList, isPlaylist]);


  // Iniciar la reproducción
  const onPlayHandler = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setIsStopped(false);
    
    if (props.playerRef.current) {
      props.playerRef.current.play()
    }
  };

  // Pausar la reproducción
  const onPauseHandler = () => {
    setIsPlaying(false);
    setIsPaused(true);
    setIsStopped(false);

    if (props.playerRef.current) {
      props.playerRef.current.pause()
    }
  };

  // Detener la reproducción
  const onStopHandler = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsStopped(true);

    if (props.playerRef.current) {
      props.playerRef.current.pause();
      props.playerRef.current.currentTime = 0
    }
  };


  // Reproducir la siguiente/anterior canción (si la hay)
  const onChangeSongHandler = (direction: "next" | "prev") => {
    if (!isPlaylist) {
      return false;
    };

    const currentSongIndex = playList.findIndex(el => el === activeId);
    
    if (direction === "next" && !isLastSong) {
      const nextSongId = playList[currentSongIndex + 1];
      setActiveId(nextSongId);
    };

    if (direction === "prev" && !isFirstSong) {
      const prevSongId = playList[currentSongIndex - 1];
      setActiveId(prevSongId);
    };
  };

  return (
    <div className="flex justify-center items-center gap-6">
      <Tooltip id="play-next" />
      <Tooltip id="play-prev" />

      <button
        className="p-1 rounded-full disabled:cursor-not-allowed disabled:opacity-60"
        data-tooltip-id="play-prev"
        data-tooltip-content="Play previous song"
        disabled={!isPlaylist || isFirstSong}
        onClick={onChangeSongHandler.bind(null, "prev")}
      >
        <AiFillStepBackward className="text-neutral-900" size={30} />
      </button>

      <div className="flex justify-center items-center gap-2">
        <button
          className={twJoin("p-2 rounded-full transition-colors", !isPlaying ? "bg-neutral-300" : "bg-green-400")}
          onClick={onPlayHandler}
        >
          <FaPlay className="text-black cursor-pointer" size={24} />
        </button>
        <button
          className={twJoin("p-2 rounded-full transition-colors", !isPaused ? "bg-neutral-300" : "bg-green-400")}
          onClick={onPauseHandler}
        >
          <FaPause className="text-black cursor-pointer" size={24} />
        </button>
        <button
          className={twJoin("p-2 rounded-full transition-colors", !isStopped ? "bg-neutral-300" : "bg-green-400")}
          onClick={onStopHandler}
        >
          <FaStop className="text-black cursor-pointer" size={24} />
        </button>
      </div>

      <button
        className="p-1 rounded-full disabled:cursor-not-allowed disabled:opacity-60"
        data-tooltip-id="play-next"
        data-tooltip-content="Play next song"
        disabled={!isPlaylist || isLastSong}
        onClick={onChangeSongHandler.bind(null, "next")}
      >
        <AiFillStepForward className="text-neutral-900" size={30} />
      </button>
    </div>
  )
};

export default PlayerControls;