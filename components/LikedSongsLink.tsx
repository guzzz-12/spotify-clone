"use client"

import Link from "next/link";
import Image from "next/image";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Tooltip } from "react-tooltip";
import useAuthModal from "@/hooks/useAuthModal";

const LikedSongsLink = () => {
  const supabase = useSessionContext();
  const session = supabase.session;
  const {onOpenChange} = useAuthModal()

  return (
    <Link
      className="relative flex items-center gap-4 w-full pr-4 rounded-md bg-neutral-100/10 transition-all group hover:bg-neutral-100/20"
      href="/liked-songs"
      onClick={(e) => {
        if (!session) {
          e.preventDefault();
          onOpenChange(true);
          return false;
        }
      }}
    >
      <Tooltip id="play-liked-songs" />
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
    </Link>
  )
};

export default LikedSongsLink;