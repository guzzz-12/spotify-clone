import SongsList from "@/components/SongList/SongsList";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import getSongs from "@/serverActions/getSongs";
import PageTitle from "@/components/PageTitle";

const Home = async () => {
  const songs = await getSongs();

  return (
    <section className="w-full h-full rounded-lg bg-neutral-900 overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="font-semibold text-3xl text-white">
            Welcome Back
          </h1>
          <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <ListItem
              name="Liked Songs"
              href="/liked"
              image="/images/like.webp"
            />
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <PageTitle title="Newest Songs" />
        <SongsList songs={songs} />
      </div>
    </section>
  )
};

export default Home;