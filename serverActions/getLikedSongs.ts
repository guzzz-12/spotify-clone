import { supabaseServerClient } from "@/utils/supabaseServerClient";
import { Song } from "@/types";

const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = await supabaseServerClient();

  // Consultar la sesión del usuario
  const {data: sessionData, error: sessionError} = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message)
  };

  // Si no está autenticado, retornar con error
  if (!sessionData.session) {
    throw new Error("You must be logged in to perform this action")
  };

  try {
    const {data, error} = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", sessionData.session.user.id)
    .order("created_at", {ascending: false});

    if (error) {
      throw new Error(error.message);
    };

    /** Extraer la canción correspondiente al liked_song */
    const songs = data.reduce((acc: Song[], item) => {
      if (item.songs) {
        acc.push(item.songs)
      };
      return acc;
    }, []);
    
    return songs;
    
  } catch (error: any) {
    console.log(`Error fetching liked songs: ${error.message}`);
    return []
  }
};

export default getLikedSongs;