import { ReactNode } from "react";
import { twMerge, ClassNameValue } from "tailwind-merge";

interface Props {
  children: ReactNode;
  className?: ClassNameValue;
};

const Box = ({children,className}: Props) => {
  return (
    <div className={twMerge("w-full h-fit rounded-lg bg-neutral-900", className)}>
      {children}
    </div>
  )
};

export default Box;