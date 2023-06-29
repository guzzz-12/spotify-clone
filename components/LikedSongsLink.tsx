"use client"

import { MouseEvent, useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { BiLoaderAlt } from "react-icons/bi";
import { UserContext } from "@/context/UserProvider";
import useAuthModal from "@/hooks/useAuthModal";
import useGetLikedSongs from "@/hooks/useGetLikedSongs";
import usePlayer from "@/hooks/usePlayer";

const LikedSongsLink = () => {
  const {user} = useContext(UserContext);
  const {push} = useRouter();
  const authModal = useAuthModal();

  const [loadSongs, setLoadSongs] = useState(false);

  const {likedSongs, loadingLikedSongs} = useGetLikedSongs(loadSongs);
  const {setActiveId, setPlayList} = usePlayer();

  // Agregar las canciones likeadas a la lista de reproducción
  useEffect(() => {
    if (likedSongs.length > 0) {
      const ids = likedSongs.map(song => song.id);
      setActiveId(ids[0]);
      setPlayList(ids);
      setLoadSongs(false);
    };

  }, [likedSongs]);

  /**
   * Ir a la página de los likes si está autenticado
   * Abrir el modal de autenticación si no está auenticado
   * */
  const onClickHandler = async () => {
    if (!user) {
      return authModal.onOpenChange(true)
    };

    push("/liked-songs")
  };


  /**
   * Cargar las canciones likeadas si está autenticado
   * Abrir el modal de autenticación si no está auenticado
   */
  const onClickPlaylistHandler = (e: MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      return authModal.onOpenChange(true)
    };

    // Indicarle al hook que inicie la consulta de las canciones likeadas
    setLoadSongs(true);
  };
  

  return (
    <button
      className="relative flex items-center gap-4 w-full pr-4 rounded-md bg-neutral-100/10 transition-all group hover:bg-neutral-100/20"
      onClick={onClickHandler}
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

      <button
        className="absolute right-3 flex justify-center items-center p-3 rounded-full bg-green-500 drop-shadow-md transition-all hover:scale-110 disabled:cursor-default"
        data-tooltip-id="play-liked-songs"
        data-tooltip-content="Play your favorite songs"
        disabled={loadingLikedSongs}
        onClick={onClickPlaylistHandler}
      >
        {loadingLikedSongs && (
          <BiLoaderAlt  className="text-black animate-spin"  />
        )}
        {!loadingLikedSongs && <FaPlay className="text-black" />}
      </button>
    </button>
  )
};

export default LikedSongsLink;