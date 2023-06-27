import Image from "next/image";
import Header from "@/components/Header";
import getLikedSongs from "@/serverActions/getLikedSongs";
import LikedSongsList from "./LikedSongsList";

export const revalidate = 0;

const LikedSongsPage = async () => {
  const likedSongs = await getLikedSongs();

  return (
    <section className="page-wrapper">
      <Header>
        <div className="mt-16">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative w-32 h-32 lg:w-44 lg:h-44">
              <Image
                className="object-cover"
                src="/images/like.webp"
                alt="Playlist"
                fill
              />
            </div>
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <p className="hidden text-sm font-semibold md:block">
                Playlist
              </p>
              <h1 className="font-bold text-4xl text-white sm:text-5xl lg:text-7xl">
                Liked Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>

      <LikedSongsList likedSongs={likedSongs} />
    </section>
  )
};

export default LikedSongsPage;