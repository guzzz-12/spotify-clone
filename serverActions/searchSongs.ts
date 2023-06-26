import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Song } from "@/types";
import { Database } from "@/types/supabase";
import { FilterBy } from "@/app/search/page";

/** Server action para consultar canciones por título */
const searchSongs = async (term: string, filterBy: FilterBy): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  try {
    const {data, error} = await supabase
    .from("songs")
    .select()
    .textSearch(
      filterBy === "title" ? "title" : "author",
      term,
      {config: "english", type: "phrase"}
    )
    .order("created_at", {ascending: false});

    if (error) {
      throw new Error(error.message);
    };
    
    return data;
    
  } catch (error: any) {
    console.log(`Error fetching songs by title: ${error.message}`);
    return []
  };
};

export default searchSongs;