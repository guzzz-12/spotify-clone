import { FaPlay } from "react-icons/fa";

const PlayBtn = () => {
  return (
    <button className="flex items-center p-4 rounded-full drop-shadow-md opacity-0 bg-green-500 transition-all hover:scale-110 group-hover:opacity-100">
      <FaPlay className="text-black" />
    </button>
  )
};

export default PlayBtn;