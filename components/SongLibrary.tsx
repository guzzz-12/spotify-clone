"use client"

import { useContext } from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { toast } from "react-hot-toast";
import SongLibraryItem from "./SongLibraryItem";
import { UserContext } from "@/context/UserProvider";
import useAuthModal from "@/hooks/useAuthModal";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import SongLibraryItemSkeleton from "./SongLibraryItemSkeleton";

interface Props {
  userSongs: Song[];
  loading: boolean;
};

const SongLibrary = ({userSongs, loading}: Props) => {
  const {user, subscription, subscriptionError} = useContext(UserContext);

  const authModalState = useAuthModal();
  const subscriptionModal = useSubscriptionModal();
  const uploadModalState = useUploadModal();

  const onClickHandler = async () => {
    // Chequear si el usuario está autenticado
    if (!user) {
      return authModalState.onOpenChange(true)
    };

    // Chequear si el usuario está suscrito
    try {
      // Si no posee suscripción, mostrar el modal de suscripción
      if (subscriptionError) {
        if (subscriptionError.code === "PGRST116") {
          return subscriptionModal.onOpenChange(true)
        };

        throw new Error(subscriptionError.message)
      };

      if (!subscription && !subscriptionError) {
        return subscriptionModal.onOpenChange(true)
      };
      
      // Permitir subir la canció si está autenticado y suscrito
      uploadModalState.onOpenChange(true);

    } catch (error: any) {
      toast.error(`Error checking subscription: ${error.message}`)
    };
  };

  return (
    <div className="flex flex-col px-5 py-4">
      <Tooltip id="add-song" />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TbPlaylist className="text-neutral-400" size={30} />
          <p className="text-base font-medium text-neutral-400">
            Your Library
          </p>
        </div>

        <AiOutlinePlus
          className="text-neutral-400 cursor-pointer hover:text-white transition-colors"
          data-tooltip-id="add-song"
          data-tooltip-content="Add song"
          size={24}
          onClick={onClickHandler}
        />
      </div>

      <div className="flex flex-col gap-2 mt-5">
        {!loading && userSongs.length === 0 &&
          <div className="flex flex-col justify-center items-center gap-1">
            <p className="text-center text-neutral-400">
              You don't have any songs yet
            </p>
            <span className="text-sm text-center text-neutral-500">
              Start uploading songs by clicking on the plus icon above
            </span>
          </div>
        }

        {userSongs.map(song => {
          return <SongLibraryItem key={song.id} song={song} />
        })}

        {loading &&
          Array(5).fill("x").map((_el, i) => {
            return (
              <SongLibraryItemSkeleton key={i} />
            )
          })
        }

      </div>
    </div>
  )
};

export default SongLibrary;