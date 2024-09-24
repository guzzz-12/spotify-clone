import { BeatLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-neutral-900 z-30 pointer-events-none">
      <BeatLoader size={20} color="rgb(74 222 128)" />
    </div>
  )
}

export default Spinner