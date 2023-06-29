import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";
import SearchInput from "./components/SearchInput";
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
  return (
    <section className="page-wrapper">
      <Header>
        <PageTitle title="Search"/>
        <SearchInput />
      </Header>
      <div className="mt-2 mb-7 px-6">
        <SearchResults params={searchParams} />
      </div>
    </section>
  )
};

export default SearchPage;