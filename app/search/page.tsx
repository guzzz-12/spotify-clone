import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";
import SearchInput from "./components/SearchInput";
import getSongsByTitle from "@/serverActions/searchSongs";
import SearchResults from "@/components/SearchResults";

export type FilterBy = "title" | "author";

interface Props {
  /** searchParams es el objeto con el query string parseado
   * y lo agrega Next.js automáticamente a los archivos page.
   * */
  searchParams: {
    term: string;
    filterBy: FilterBy;
  }
};

const SearchPage = async ({searchParams}: Props) => {
  const {term, filterBy} = searchParams;
  const songs = await getSongsByTitle(term, filterBy);

  return (
    <section className="w-full h-full rounded-lg bg-neutral-900 overflow-hidden overflow-y-auto">
      <Header>
        <PageTitle title="Search"/>
        <SearchInput />
      </Header>
      <div className="mt-2 mb-7 px-6">
        <SearchResults songs={songs} />
      </div>
    </section>
  )
};

export default SearchPage;