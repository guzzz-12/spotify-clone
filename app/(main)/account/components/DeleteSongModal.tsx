"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import GenericModal from "@/components/GenericModal";
import Button from "@/components/Button";

interface Props {
  isOpen: boolean;
  songId: number | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteSongModal = ({isOpen, songId, setIsOpen}: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  /** Eliminar la canción de la base de datos */
  const deleteSongHandler = async () => {
    try {
      setIsLoading(true);
      
      await axios({
        method: "GET",
        url: `/api/songs/delete-song?song_id=${songId}`
      });

      // Cerrar el modal y refrescar la página
      setIsOpen(false);
      router.refresh();

      toast.success("Song deleted successfully");

    } catch (error) {
      toast.error("Error deleting song. Refresh the page and try again")

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GenericModal
      title="Delete song?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onOpenChange={() => {
        if (isLoading) {
          return false;
        }
        setIsOpen(false);
      }}
    >
      <div className="flex justify-center items-center gap-2">
        <Button
          className="text-white bg-red-700"
          disabled={isLoading}
          onClickHandler={deleteSongHandler}
        >
          Confirm
        </Button>
        <Button
          className="text-white bg-neutral-500/60 hover:bg-neutral-500/40 transition-colors"
          disabled={isLoading}
          onClickHandler={setIsOpen.bind(null, false)}
        >
          Cancel
        </Button>
      </div>
    </GenericModal>
  )
}

export default DeleteSongModal;