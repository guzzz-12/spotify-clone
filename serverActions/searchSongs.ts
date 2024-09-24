import { FilterBy } from "@/app/(main)/search/page";
import { supabaseServerClient } from "@/utils/supabaseServerClient";
import { Song } from "@/types";

/** Server action para consultar canciones por título */
const searchSongs = async (term: string, filterBy: FilterBy): Promise<Song[]> => {
  const supabase = await supabaseServerClient();

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