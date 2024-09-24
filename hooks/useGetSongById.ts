import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useCurrentSession from "./useCurrentSession";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";
import { Song } from "@/types";

/**
 * Buscar la url de una canción mediante su ID.
 */
const useGetSongById = (songId: number | null) => {
  const [songData, setSongData] = useState<Song | null>(null);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = supabaseBrowserClient;

  const session = useCurrentSession(state => state.session);

  useEffect(() => {
    const fetchSong = async (songId: number | null) => {
      if (!session || !songId) {
        return null;
      };

      try {
        setIsLoading(true);

        // Consultar el path de la canción de la DB
        const {data: songData, error} = await supabase
        .from("songs")
        .select("*")
        .eq("id", songId)
        .single();

        if (error) {
          throw new Error(error.message)
        };
        

        // Extraer la URL de la canción del bucket
        const {data: {publicUrl}} = supabase
        .storage
        .from("songs")
        .getPublicUrl(songData.song_path)

        setSongData(songData);
        setSongUrl(publicUrl);

      } catch (error: any) {
        toast.error(`Error loading song: ${error.message}`)

      } finally {
        setIsLoading(false)
      };
    };

    fetchSong(songId);

  }, [songId, session]);

  return {songData, songUrl, isLoading}
};

export default useGetSongById;