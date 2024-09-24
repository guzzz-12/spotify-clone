import { Song } from "@/types";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";

/** Consultar la URL de la imagen de la canción especificada */
const useLoadImage = (song: Song) => {
  const supabase = supabaseBrowserClient;

  if (!song) {
    return null;
  };

  const {data} = supabase.storage.from("images").getPublicUrl(song.image_url);

  return data.publicUrl;
};

export default useLoadImage;