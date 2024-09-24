import SearchResultItem from "./SearchResultItem";
import { FilterBy } from "@/app/(main)/search/page";
import getSongsByTitle from "@/serverActions/searchSongs";

interface Props {
  params: {
    term: string;
    filterBy: FilterBy;
  };
};

const SearchResults = async ({params}: Props) => {
  const {term, filterBy} = params;

  const songs = await getSongsByTitle(term, filterBy);

  if (!term || term.trim().length === 0) {
    return (
      <h2 className="mt-4 text-lg text-neutral-400">
        Type the search term...
      </h2>
    )
  };

  if (songs.length === 0) {
    return (
      <h2 className="mt-4 text-lg text-neutral-400">
        No songs found...
      </h2>
    );
  };

  return (
    <section className="grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-2">
      {songs.map(song => {
        return (
          <SearchResultItem key={song.id} song={song} />
        )
      })}
    </section>
  )
};

export default SearchResults;