import SongLibraryItemSkeleton from "@/components/SongLibraryItemSkeleton";

const Loading = () => {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-2">
      <SongLibraryItemSkeleton />
      <SongLibraryItemSkeleton />
      <SongLibraryItemSkeleton />
      <SongLibraryItemSkeleton />
      <SongLibraryItemSkeleton />
      <SongLibraryItemSkeleton />
    </section>
  )
};

export default Loading;
