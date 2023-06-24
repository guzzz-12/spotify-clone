"use client"

import { useContext } from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai"
import { UserContext } from "@/context/UserProvider";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";

const SongLibrary = () => {
  const {user} = useContext(UserContext);

  const authModalState = useAuthModal();
  const uploadModalState = useUploadModal();

  const onClickHandler = () => {
    if (!user) {
      return authModalState.onOpenChange(true)
    };

    uploadModalState.onOpenChange(true);
  };

  return (
    <div className="flex flex-col px-5 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TbPlaylist className="text-neutral-400" size={30} />
          <p className="text-base font-medium text-neutral-400">
            Your Library
          </p>
        </div>

        <AiOutlinePlus
          className="text-neutral-400 cursor-pointer hover:text-white transition-colors"
          size={24}
          onClick={onClickHandler}
        />
      </div>

      <div className="flex flex-col gap-2 mt-5">
        List of songs
      </div>
    </div>
  )
};

export default SongLibrary;