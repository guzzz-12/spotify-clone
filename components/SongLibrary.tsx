"use client"

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

const SongLibrary = () => {
  const onClickHandler = () => {
    // Lógica para subir canciones
  };

  return (
    <div className="flex flex-col px-5 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TbPlaylist className="text-neutral-400" size={30} />
          <p className="text-base font-medium text-neutral-400">
            Your Library
          </p>
        </div>

        <AiOutlinePlus
          className="text-neutral-400 cursor-pointer hover:text-white transition-colors"
          size={24}
          onClick={() => null}
        />
      </div>

      <div className="flex flex-col gap-2 mt-5">
        List of songs
      </div>
    </div>
  )
};

export default SongLibrary;