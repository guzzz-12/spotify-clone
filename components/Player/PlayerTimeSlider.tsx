"use client"

import { MutableRefObject, useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

interface Props {
  playerRef: MutableRefObject<HTMLAudioElement | null>;
};

const PlayerTimeSlider = ({playerRef}: Props) => {
  const [currentTimeParsed, setCurrentTimeParsed] = useState(() => "00:00");
  const [duration, setDuration] = useState<number[]>([0]);
  const [currentTime, setCurrentTime] = useState<number[]>([0]);

  /*------------------------------------------------------------------------------*/
  // Convertir la duración de la canción en segundos a minutos y segundos (00:00)
  /*------------------------------------------------------------------------------*/
  const timeParser = (time: number[]) => {
    const minutes = Math.floor(Math.round(time[0]) / 60);
    const seconds = Math.round(time[0] % 60);

    const parsedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const parsedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return {
      minutes: parsedMinutes,
      seconds: parsedSeconds
    }
  };


  /**
   * Inicializar el state de la duración de la canción
   * y actualizar el state del cronómetro mientras se reproduce.
   */
  useEffect(() => {
    const player = (playerRef.current as HTMLAudioElement);

    if (player) {
      player.onloadedmetadata = () => {
        setDuration([Math.round(player.duration)]);
      };

      player.ontimeupdate = () => {
        const current = +(player.currentTime.toFixed(1));
        const timeParsed = timeParser([current]);
        const timeFormatted = `${timeParsed.minutes}:${timeParsed.seconds}`;

        setCurrentTime([current]);
        setCurrentTimeParsed(timeFormatted)
      }
    };

  }, [playerRef]);


  return (
    <form className="flex justify-between items-center gap-3">
      <Slider.Root
        className="relative flex items-center w-full h-5 select-none touch-none"
        defaultValue={currentTime}
        max={duration[0]}
        step={1}
        value={currentTime}
        onValueChange={(time) => {
          if (playerRef.current) {
            setCurrentTime(time);
            playerRef.current.currentTime = time[0]
          }
        }}
      >
        <Slider.Track className="relative grow h-[4px] bg-gray-600 rounded-full">
          <Slider.Range className="absolute h-full bg-green-400 rounded-full" />
        </Slider.Track>
      </Slider.Root>

      <div className="flex justify-center items-center gap-1 flex-shrink-0">
        <p className="text-sm">
          {currentTimeParsed}
        </p>

        <span>/</span>

        <p className="text-sm">
          {timeParser(duration).minutes}:{timeParser(duration).seconds}
        </p>
      </div>
    </form>
  )
};

export default PlayerTimeSlider;