import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "react-tooltip";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface Props {
  song: Song;
  iconSize?: "sm" | "md" | "lg";
  isAddedToPlayList: boolean;
  /**
   * La página o componente desde donde se está renderizando el botón.
   * Es necesario para generar una ID única en caso de que se muestre
   * en diferentes lugares simultáneamente.
   */
  path: string;
  className?: HTMLAttributes<Element>["className"];
}

const AddToPlaylistBtn = ({song, iconSize="sm", path, className, isAddedToPlayList}: Props) => {
  const {addToPlayList, removeFromPlayList} = usePlayer();
  
  return (
    <>
      <Tooltip id={`add-${song.id}-${path}`} className="z-100" />
      <button
        className={twMerge("flex justify-center items-center flex-shrink-0 rounded-full transition-colors", className)}
        data-tooltip-id={`add-${song.id}-${path}`}
        data-tooltip-content={isAddedToPlayList ? "Remove from playlist" : "Add to playlist"}
        onClick={(e) => {
          e.stopPropagation();
          if (!isAddedToPlayList) {
            addToPlayList(song.id);
          } else {
            removeFromPlayList(song.id);
          }
        }}
      >
        {isAddedToPlayList && (
          <FaTimes className={twMerge("flex-shrink-0 text-inherit")} />
        )}
        {!isAddedToPlayList && (
          <MdOutlinePlaylistAdd className={twMerge("flex-shrink-0 text-inherit", iconSize === "sm" ? "w-4 h-4" : iconSize === "md" ? "w-6 h-6" : "w-8 h-8")} />
        )}
      </button>
    </>
  )
}

export default AddToPlaylistBtn;