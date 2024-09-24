"use client"

import Box from "@/components/Box";
import Button from "@/components/Button";

interface Props {
  error: Error;
  reset: () => void
};

const Error = ({error, reset}: Props) => {
  console.log({error: error.message});

  return (
    <Box className="flex flex-col justify-center items-center gap-3 h-full">
      <h2 className="text-2xl text-neutral-400">
        Something went wrong
      </h2>
      <Button onClickHandler={reset}>
        Reload the page
      </Button>
    </Box>
  )
};

export default Error;