"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { FaPlay } from "react-icons/fa";

interface Props {
  name: string;
  href: string;
  image: string;
};

const ListItem = (props: Props) => {
  const {name, href, image} = props;

  const {push} = useRouter();

  const onClickButtonHandler = () => {
    // Agregar autenticación antes de ejecutar el push
    // push(href)
    console.log("Button link clicked")
  };

  const onClickPlayHandler = (e: MouseEvent) => {
    e.stopPropagation();
    console.log("Play button clicked")
  };

  return (
    <button
      className="relative flex items-center gap-4 w-full pr-4 rounded-md bg-neutral-100/10 overflow-hidden transition-all group hover:bg-neutral-100/20"
      onClick={onClickButtonHandler}
    >
      <div className="relative min-w-[64px] min-h-[64px]">
        <Image className="object-cover" src={image} fill alt="like icon" />
      </div>
      <p className="py-5 font-medium truncate">
        {name}
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

export default ListItem;