"use client"

import { MutableRefObject, useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import {BsFillVolumeUpFill, BsFillVolumeMuteFill} from "react-icons/bs";

interface Props {
  initialVolume: number[];
  playerRef: MutableRefObject<HTMLAudioElement | null>;
  updateInitialVolume: (vol: number[]) => void;
};

const PlayerVolumeSlider = ({initialVolume, updateInitialVolume, playerRef}: Props) => {  
  const [volume, setVolume] = useState<number[]>(() => initialVolume);

  useEffect(() => {
    if (playerRef.current) {
      const player = (playerRef.current as HTMLAudioElement);
      const parsedVolume = +((volume[0] / 100).toFixed(2));
      player.volume = parsedVolume;
    }
  }, [playerRef, volume]);

  return (
    <form
      className="flex justify-end items-center gap-3 mr-9"
      onSubmit={(e) => e.preventDefault()}
    >
      <button
        className="rounded-full"
        type="button"
        onClick={() => setVolume([0])}
      >
        <BsFillVolumeMuteFill className="text-neutral-900 cursor-pointer" size={30} />
      </button>

      <Slider.Root
        className="relative flex items-center w-[120px] h-5 select-none touch-none"
        defaultValue={initialVolume}
        max={100}
        step={1}
        value={volume}
        onValueChange={(vol) => {
          setVolume(vol);
          updateInitialVolume(vol);
        }}
      >
        <Slider.Track className="relative grow h-[3px] bg-gray-600 rounded-full">
          <Slider.Range className="absolute h-full bg-neutral-900 rounded-full" />
        </Slider.Track>
        <Slider.Thumb 
          className="block w-5 h-5 bg-neutral-900 rounded-[10px] cursor-pointer outline-2 outline-transparent focus:outline-blue-500 hover:bg-neutral-700 transition-colors"
          aria-label="Volume"
        />
      </Slider.Root>

      <button
        className="flex justify-start items-center rounded-full"
        type="button"
        onClick={() => setVolume([100])}
      >
        <BsFillVolumeUpFill className="text-neutral-900 cursor-pointer" size={30} />
      </button>
    </form>
  )
};

export default PlayerVolumeSlider;