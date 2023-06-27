import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Song } from "@/types";
import { Database } from "@/types/supabase";

/** Server action para consultar las canciones del usuario autenticado */
const getCurrentUserSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  try {
    // Consultar la sesión del usuario
    const {data: sessionData, error: sessionError} = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message)
    };

    if (!sessionData.session) {
      throw new Error("You must be logged in to perform this action")
    };

    // Consultar las canciones del usuario
    const {data, error} = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session.user.id)
    .order("created_at", {ascending: false});

    if (error) {
      throw new Error(error.message)
    };

    return data;
    
  } catch (error: any) {
    console.log(`Error fetching songs: ${error.message}`);
    return []
  };
};

export default getCurrentUserSongs;