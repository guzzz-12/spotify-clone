"use client";

import { BeatLoader } from "react-spinners";
import Box from "@/components/Box";

const Loading = () => {
  return (
    <Box className="flex justify-center items-center h-full">
      <BeatLoader size={20} color="rgb(74 222 128)" />
    </Box>
  )
};

export default Loading;