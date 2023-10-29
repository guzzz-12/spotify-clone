"use client"

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { LuGrip } from "react-icons/lu";
import { Song } from "@/types";

interface Props {
  song: Song;
  activeSongId: number | null;
  setActiveSongId: (id: number) => void;
}

const PlayListModalItem = ({song, activeSongId, setActiveSongId}: Props) => {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: song.id});

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <button
      key={song.id}
      className="flex justify-start items-center w-full pr-2 bg-neutral-700"
      ref={setNodeRef}
      style={styles}
      onClick={() => setActiveSongId(song.id)}
    >
      <Image
        className="block mr-2 flex-shrink-0 rounded-sm"
        width={40}
        height={40}
        src={song.image_url || "/images/song-default-image.webp"}
        alt={`${song.title} image`}
      />

      <div className="flex flex-col justify-between items-start gap-0 p-1 flex-grow overflow-hidden">
        <p className="max-w-full font-semibold text-sm text-neutral-100 truncate">
          {song.title}
        </p>
        <p className="max-w-full text-neutral-300 text-xs truncate">
          {song.author}
        </p>
      </div>

      <AnimatePresence>
        {activeSongId === song.id &&
          <motion.p
            className="ml-auto mr-2 text-sm text-slate-300 italic"
            initial={{x: "-100%", opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: "-100%", opacity: 0}}
          >
            Now playing...
          </motion.p>
        }
      </AnimatePresence>

      <div
        className="p-1 flex-shrink-0 border border-neutral-600 rounded-md"
        data-tooltip-id="drag-btn"
        data-tooltip-content="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <LuGrip className="w-4 h-4 cursor-move" />
      </div>
    </button>
  )
}

export default PlayListModalItem;