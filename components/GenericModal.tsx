"use client"

import { useEffect, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  isOpen: boolean;
  title: string | ReactNode;
  description: string | ReactNode;
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
    <AnimatePresence>
      <Dialog.Root
        open={isOpen}
        defaultOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              key="modal-overlay"
              className="fixed inset-0 backdrop-blur-sm bg-neutral-900/80 z-[1000]"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              key="modal-content"
              className="fixed top-[50%] left-[50%] w-full h-full p-6 -translate-x-[50%] -translate-y-[50%] drop-shadow-md border rounded-md bg-neutral-800 overflow-y-auto focus:outline-none border-neutral-700 md:w-[90vw] md:max-w-[450px] md:h-auto md:max-h-[85vh] z-[1000]"
              initial={{x: "-50%", y: "-60%", opacity: 0}}
              animate={{x: "-50%", y: "-50%", opacity: 1}}
              exit={{x: "-50%", y: "-60%", opacity: 0}}
            >
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 flex justify-center items-center w-6 h-6 rounded-full appearance-none text-neutral-400 hover:text-white">
                  <AiOutlineClose />
                </button>
              </Dialog.Close>
              <Dialog.Title className="mb-2 text-center text-xl text-white font-semibold">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mb-5 text-sm text-center text-gray-400 leading-normal">
                {description}
              </Dialog.Description>
              <div>
                {children}
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AnimatePresence>
  )
};

export default GenericModal;