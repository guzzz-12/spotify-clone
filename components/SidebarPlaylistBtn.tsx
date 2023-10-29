"use client"

import { Tooltip } from "react-tooltip";
import { MdPlaylistPlay } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import usePlayer from "@/hooks/usePlayer";
import usePlaylistModal from "@/hooks/usePlaylistModal";

const SidebarPlaylistBtn = () => {
  const {resetPlayer} = usePlayer();
  const {openPlaylist} = usePlaylistModal();

  return (
    <button
      className="flex justify-between items-center w-full px-3 py-2 rounded-md bg-neutral-800/50 hover:bg-neutral-800/90 transition-colors"
      onClick={() => openPlaylist(true)}
    >
      <Tooltip id="delete-playlist" />
      <div className="flex items-center gap-2">
        <MdPlaylistPlay className="text-neutral-400" size={30} />
        <p className="text-base font-medium text-neutral-400">
          Your Playlist
        </p>
      </div>

      <BsTrash
        className="text-neutral-400 cursor-pointer hover:text-white transition-colors"
        data-tooltip-id="delete-playlist"
        data-tooltip-content="Delete playlist"
        size={18}
        onClick={(e) => {
          e.stopPropagation();
          resetPlayer();
        }}
      />
    </button>
  )
}

export default SidebarPlaylistBtn;