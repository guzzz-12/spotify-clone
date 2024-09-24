"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import useCurrentSession from "@/hooks/useCurrentSession";

const LikedSongsLink = () => {
  const {replace} = useRouter();

  const session = useCurrentSession(state => state.session);

  return (
    <Link
      className="relative flex items-center gap-4 w-full pr-4 rounded-md bg-neutral-100/10 transition-all group hover:bg-neutral-100/20 overflow-hidden"
      href="/liked-songs"
      onClick={(e) => {
        if (!session) {
          e.preventDefault();
          replace("/signin");
        }
      }}
    >
      <Tooltip id="play-liked-songs" />
      <div className="relative w-[64px] h-[64px]">
        <img
          className="w-full h-auto object-center object-cover"
          src="/images/like.webp"
          alt="like icon"
        />
      </div>

      <p className="py-5 font-medium truncate">
        Liked Songs
      </p>
    </Link>
  )
};

export default LikedSongsLink;