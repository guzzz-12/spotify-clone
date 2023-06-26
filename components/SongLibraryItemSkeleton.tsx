const SongLibraryItemSkeleton = () => {
  return (
    <div className="flex items-center gap-3 w-full p-2 rounded-md bg-neutral-800/50 animate-pulse">
      <div className="relative w-12 h-12 flex-shrink-0 rounded-md bg-neutral-800/80 animate-pulse" />
      <div className="flex flex-col justify-center items-start">
        <div className="w-full h-4 bg-neutral-800/80 animate-pulse" />
        <div className="w-[40%] h-3 bg-neutral-800/80 animate-pulse" />
      </div>
    </div>
  )
};

export default SongLibraryItemSkeleton;