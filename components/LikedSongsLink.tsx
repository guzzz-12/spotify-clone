"use client"

import { MouseEvent, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { UserContext } from "@/context/UserProvider";
import useAuthModal from "@/hooks/useAuthModal";

const LikedSongsLink = () => {
  const {user} = useContext(UserContext);
  const {push} = useRouter();
  const {onOpenChange} = useAuthModal();


  const onClickHandler = () => {
    if (!user) {
      return onOpenChange(true)
    };

    push("/liked-songs")
  };


  const onClickPlayHandler = (e: MouseEvent) => {
    e.stopPropagation();
    console.log("Play button clicked")
  };
  

  return (
    <button
      className="relative flex items-center gap-4 w-full pr-4 rounded-md bg-neutral-100/10 overflow-hidden transition-all group hover:bg-neutral-100/20"
      onClick={onClickHandler}
    >
      <div className="relative min-w-[64px] min-h-[64px]">
        <Image
          className="object-cover"
          src="/images/like.webp"
          fill
          alt="like icon"
        />
      </div>

      <p className="py-5 font-medium truncate">
        Liked Songs
      </p>

      <div
        className="absolute right-3 flex justify-center items-center p-3 rounded-full opacity-0 bg-green-500 drop-shadow-md transition-all hover:scale-110 group-hover:opacity-100"
        onClick={onClickPlayHandler}
      >
        <FaPlay className="text-black" />
      </div>
    </button>
  )
};

export default LikedSongsLink;