import { supabaseServerClient } from "@/utils/supabaseServerClient";
import { Song } from "@/types";

/** Server action para consultar todas las canciones */
const getSongs = async (): Promise<Song[]> => {
  const supabase = await supabaseServerClient();

  try {
    const {data, error} = await supabase
    .from("songs")
    .select("*")
    .order("created_at", {ascending: false});

    if (error) {
      throw new Error(error.message);
    };
    
    return data;
    
  } catch (error: any) {
    console.log(`Error fetching songs: ${error.message}`);
    return []
  };
};

export default getSongs;