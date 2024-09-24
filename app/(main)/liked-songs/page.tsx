import { redirect } from "next/navigation";
import Header from "@/components/Header";
import getLikedSongs from "@/serverActions/getLikedSongs";
import LikedSongsList from "./LikedSongsList";
import { supabaseServerClient } from "@/utils/supabaseServerClient";

export const revalidate = 0;

const LikedSongsPage = async () => {
  const supabase = await supabaseServerClient();
  const {data} = await supabase.auth.getUser();

  if (!data.user) {
    return redirect("/");
  }

  const likedSongs = await getLikedSongs();

  return (
    <section className="page-wrapper">
      <Header>
        <div className="mt-16">
          <div className="flex flex-col items-center gap-2 sm:gap-5 sm:flex-row">
            <div className="relative w-full max-w-[120px] aspect-square">
              <img
                className="block w-full object-cover"
                src="/images/like.webp"
                alt="Playlist"
              />
            </div>
            <div className="flex flex-col gap-2 md:mt-0">
              <h1 className="font-bold text-3xl text-white">
                Your Liked Songs
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