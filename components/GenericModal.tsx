"use client"

import { useEffect, useState, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  children: ReactNode;
  onOpenChange: (isOpen: boolean) => void;
};

const GenericModal = (props: Props) => {
  const {isOpen, title, description, children, onOpenChange} = props;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, []);

  if (!isMounted) {
    return null;
  };

  return (
    <Dialog.Root
      open={isOpen}
      defaultOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-neutral-900/80"/>
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full h-full p-6 -translate-x-[50%] -translate-y-[50%] drop-shadow-md border rounded-md bg-neutral-800 focus:outline-none border-neutral-700 md:w-[90vw] md:max-w-[450px] md:h-auto md:max-h-[85vh]">
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 flex justify-center items-center w-6 h-6 rounded-full appearance-none text-neutral-400 hover:text-white">
              <AiOutlineClose />
            </button>
          </Dialog.Close>
          <Dialog.Title className="mb-4 text-center text-xl font-bold">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-center leading-normal">
            {description}
          </Dialog.Description>
          <div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default GenericModal;