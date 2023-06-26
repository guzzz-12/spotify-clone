import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";
import SearchInput from "./components/SearchInput";
import getSongsByTitle from "@/serverActions/getSongsByTitle";
import SongsList from "@/components/SongList/SongsList";

interface Props {
  /** searchParams es el query string y lo agrega Next.js
   * automáticamente a los archivos page.
   * */
  searchParams: {
    songTitle: string;
  }
};

const SearchPage = async ({searchParams}: Props) => {
  const songs = await getSongsByTitle(searchParams.songTitle);

  return (
    <section className="w-full h-full rounded-lg bg-neutral-900 overflow-hidden overflow-y-auto">
      <Header>
        <PageTitle title="Search"/>
        <SearchInput />
      </Header>
      <div className="mt-2 mb-7 px-6">
        <SongsList songs={songs} />
      </div>
    </section>
  )
};

export default SearchPage;