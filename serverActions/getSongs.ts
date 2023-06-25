import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Song } from "@/types";
import { Database } from "@/types/supabase";

/** Server action para consultar todas las canciones */
const getSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

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