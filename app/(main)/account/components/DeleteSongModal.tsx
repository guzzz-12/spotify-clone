"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GenericModal from "@/components/GenericModal";
import Button from "@/components/Button";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";

interface Props {
  isOpen: boolean;
  songId: number | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteSongModal = ({isOpen, songId, setIsOpen}: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  
  const supabase = supabaseBrowserClient;

  /** Eliminar la canción de la base de datos */
  const deleteSongHandler = async () => {
    try {
      setIsLoading(true);

      // Buscar el path de la imagen de la canción
      const {data: songData} = await supabase
      .from("songs")
      .select("song_path, image_url")
      .eq("id", `${songId}`)
      .limit(1);

      if (!songData) {
        throw new Error("Song not found")
      }

      // Eliminar la canción y su imagen del bucket
      await supabase
      .storage
      .from("images")
      .remove([songData[0].song_path, songData[0].image_url]);
      
      // Eliminar la canción de la base de datos
      await supabase
      .from("songs")
      .delete()
      .eq("id", `${songId}`);

      // Cerrar el modal y refrescar la página
      setIsOpen(false);
      router.refresh();

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