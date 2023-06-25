import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Song } from "@/types";
import { Database } from "@/types/supabase";

/** Consultar la URL de la imagen de la canción especificada */
const useLoadImage = (song: Song) => {
  const supabase = useSupabaseClient<Database>();

  if (!song) {
    return null;
  };

  const {data} = supabase.storage.from("images").getPublicUrl(song.image_url);

  return data.publicUrl;
};

export default useLoadImage;