import SongItemSkeleton from "@/components/SongList/SongItemSkeleton";

const Loading = () => {
  return (
    <section className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
      <SongItemSkeleton />
    </section>
  )
};

export default Loading;