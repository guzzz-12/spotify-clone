import { Suspense } from "react";
import SongsList from "@/components/SongList/SongsList";
import Header from "@/components/Header";
import LikedSongsLink from "@/components/LikedSongsLink";
import PageTitle from "@/components/PageTitle";
import Loading from "./loading";

const Home = () => {
  return (
    <section className="page-wrapper">
      <Header>
        <div className="mb-2">
          <h1 className="font-semibold text-3xl text-white">
            Welcome Back
          </h1>
          <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <LikedSongsLink/>
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <PageTitle title="Newest Songs" />
        <Suspense fallback={<Loading />}>
          <SongsList />
        </Suspense>
      </div>
    </section>
  )
};

export default Home;