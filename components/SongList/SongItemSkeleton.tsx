const SongItemSkeleton = () => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-4 p-3 rounded-md bg-neutral-800/50 animate-pulse">
      <div className="w-full min-w-[90px] aspect-square rounded-md bg-neutral-800/80 animate-pulse"/>
      <div className="flex flex-col items-start gap-1 w-full">
        <div className="w-[90%] h-5 bg-neutral-800/80 animate-pulse" />
        <div className="w-[50%] h-3 bg-neutral-800/80 animate-pulse" />
      </div>
    </div>
  )
};

export default SongItemSkeleton;