import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Song } from "@/types";
import { Database } from "@/types/supabase";

/** Server action para consultar todas las canciones subidas por el usuario */
const getUserUploadedSongs = async (userId: string): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  try {
    const {data, error} = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {ascending: false});

    if (error) {
      throw new Error(error.message);
    };
    
    return data;
    
  } catch (error: any) {
    console.log(`Error fetching user uploaded songs: ${error.message}`);
    return []
  };
};

export default getUserUploadedSongs;