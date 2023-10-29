"use client"

import { useEffect, useState } from "react";
import { useSessionContext,SupabaseClient } from "@supabase/auth-helpers-react";
import { DndContext, DragEndEvent, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { BeatLoader } from "react-spinners";
import { Tooltip } from "react-tooltip";
import { FaPlay } from "react-icons/fa";
import GenericModal from "./GenericModal";
import Box from "./Box";
import PlayListModalItem from "./PlayListModalItem";
import usePlayer from "@/hooks/usePlayer";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import { Song } from "@/types";
import { Database } from "@/types/supabase";

const PlaylistModal = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const {isPlaylistOpen, openPlaylist} = usePlaylistModal();
  const {playList, setPlayList, activeId, setActiveId, removeFromPlayList} = usePlayer();

  const supabase = useSessionContext();
  const supabaseClient: SupabaseClient<Database> = supabase.supabaseClient;

  /** Query para consultar la data de las canciones del playlist */
  const getSongsData = async (ids: number[]) => {
    try {
      const currentPlaylist = JSON.stringify([...playList].sort((a, b) => a - b));
      const currentSongs = JSON.stringify([...songs].map(el => el.id).sort((a, b) => a - b));

      // No ejecutar el query si los arrays son equivalentes
      // Esto es en el caso donde se reorganiza el playlist
      if(currentPlaylist === currentSongs) {
        return false;
      };

      setLoading(true);
      
      const {data} = await supabaseClient
      .from("songs")
      .select("*")
      .in("id", ids)
      .order("created_at", {ascending: false});

      if (!data) {
        return null;
      }

      const songsWithImage: Song[] = [];

      // Buscar el public url de la imagen de la canción en el bucket
      for(let item of data) {
        const itemWithImageUrl = {...item};
        const {data: {publicUrl}} = supabaseClient.storage.from("images").getPublicUrl(item.image_url);
        itemWithImageUrl.image_url = publicUrl;

        songsWithImage.push(itemWithImageUrl);
      };

      setSongs(songsWithImage);

    } catch (error: any) {
      console.log(`Error fetching playlist: ${error.message}`);

    } finally {
      setLoading(false);
    }
  }

  // Prevenir que se propague el click del botón de drag
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));

  /**
   * Reorganizar el state global del playlist
   * y el state local de las canciones
   * al finalizar soltar el elemento
   * en una posición diferente a la original
   */
  const onDragEndHandler = (dragEvent: DragEndEvent) => {
    const {active, over} = dragEvent;

    // Reordenar las canciones  si se sueltan en un orden diferente
    // Active es el elemento que se está arrastrando
    // Over es el elemento que queda por encima del elemento Active al soltarlo
    if (active.id !== over?.id) {
      const currentPlaylist = [...playList];
      const currentSongs = [...songs];

      // Índices de los items del state del global del playlist
      const activePlaylistItemIndex = currentPlaylist.findIndex(id => id === active.id);
      const overPlaylistItemIndex = currentPlaylist.findIndex(id => id === over?.id);

      // Índices de los items del state local de las canciones
      const activeSongItemIndex = currentSongs.findIndex(song => song.id === active.id);
      const overSongItemIndex = currentSongs.findIndex(song => song.id === over?.id);

      // Reordenar el state global del playlist
      const reorderedPlaylistState = arrayMove(currentPlaylist, activePlaylistItemIndex, overPlaylistItemIndex);

      // Reordenar el stae local de las canciones
      const reorderedSongsState = arrayMove(currentSongs, activeSongItemIndex, overSongItemIndex);

      setPlayList(reorderedPlaylistState);
      setSongs(reorderedSongsState);
    }
  }


  /** Iniciar la reproducción del playlist y cerrar el modal */
  const onPlayHandler = () => {
    setActiveId(songs[0].id);
    openPlaylist(false);
  }


  /** Consultar la data de las canciones al agregar canciones al state del playlist */
  useEffect(() => {
    if (playList.length > 0) {
      getSongsData(playList)
    }
  }, [playList, supabaseClient]);


  return (
    <GenericModal
      title="Playlist"
      description="Your current playlist"
      isOpen={isPlaylistOpen}
      onOpenChange={openPlaylist}
    >
      {loading && 
        <Box className="flex justify-center items-center h-full bg-transparent">
          <BeatLoader className="bg-transparent" size={20} color="rgb(74 222 128)" />
        </Box>
      }

      {!loading && songs.length === 0 &&
        <div className="flex justify-center items-center w-full h-[120px] px-3 py-2">
          <p className="text-center text-gray-400">
            The playlist is empty
          </p>
        </div>
      }

      {!loading && songs.length > 0 &&
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={onDragEndHandler}
          sensors={sensors}
        >
          <div className="flex flex-col justify-start gap-2">
            <Tooltip id="start-playlist" />
            <Tooltip id="drag-btn" />

            <AnimatePresence>
              {!activeId &&
                <motion.button
                  className="flex justify-center items-center py-2 rounded-full bg-green-500 drop-shadow-md transition-all hover:bg-green-700"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  data-tooltip-id="start-playlist"
                  data-tooltip-content="Play all"
                  onClick={onPlayHandler}
                >
                  <FaPlay className="text-black" />
                </motion.button>
              }
            </AnimatePresence>

            <SortableContext
              items={songs}
              strategy={verticalListSortingStrategy}
            >
              {songs.map((song) => {
                return (
                  <PlayListModalItem
                    key={song.id}
                    song={song}
                    activeSongId={activeId}
                    setActiveSongId={setActiveId}
                  />
                )
              })}
            </SortableContext>
          </div>
        </DndContext>
      }
    </GenericModal>
  )
}

export default PlaylistModal;