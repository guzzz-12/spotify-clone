"use client"

import { useContext, useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import { UserContext } from "@/context/UserProvider";
import { Database } from "@/types/supabase";

interface Props {
  songId: number;
};

const LikeBtn = ({songId}: Props) => {
  const {refresh} = useRouter();
  const {user} = useContext(UserContext);
  const supabase = useSupabaseClient<Database>();
  
  const authModal = useAuthModal();

  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfLiked = async (user: User) => {
      try {
        setIsLoading(true);

        const {data, error} = await supabase
        .from("liked_songs")
        .select("*")
        .match({user_id: user.id, song_id: songId})
        .single();

        if (error) {
          throw new Error(error.message)
        };

        setIsLiked(!!data);

      } catch (error: any) {
        console.log(error.message);

      } finally {
        setIsLoading(false)
      };
    };

    if (user) {
      checkIfLiked(user)
    };
  }, [user, songId]);


  const onClickHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user) {
      return authModal.onOpenChange(true)
    };

    try {
      setIsLoading(true);
      
      if (!isLiked) {
        setIsLiked(true);

        const {error} = await supabase
        .from("liked_songs")
        .insert({user_id: user.id, song_id: songId});

        if (error) {
          throw new Error(error.message)
        };

      } else {
        setIsLiked(false);

        const {error} = await supabase
        .from("liked_songs")
        .delete()
        .match({user_id: user.id, song_id: songId})
        .single();

        if (error) {
          throw new Error(error.message)
        };
      };
      
      refresh();
      
    } catch (error: any) {
      console.log(error.message);
      
    } finally {
      setIsLoading(false)
    }
  };


  return (
    <button
      className="min-w-[30px] text-green-400"
      disabled={isLoading}
      onClick={onClickHandler}
    >
      <AnimatePresence mode="wait" initial={true}>
        {isLiked && (
          <motion.div
            key="liked"
            className="cursor-pointer"
            initial={{scale: "50%", opacity: 0, origin: "center"}}
            animate={{scale: "100%", opacity: 1, origin: "center"}}
            exit={{scale: "50%", opacity: 0, origin: "center"}}
          >
            <AiFillHeart size={30} />
          </motion.div>
        )}

        {!isLiked && (
          <motion.div
            key="disliked"
            className="cursor-pointer"
            initial={{scale: "50%", opacity: 0, origin: "center"}}
            animate={{scale: "100%", opacity: 1, origin: "center"}}
            exit={{scale: "50%", opacity: 0, origin: "center"}}
          >
            <AiOutlineHeart size={30} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
};

export default LikeBtn;