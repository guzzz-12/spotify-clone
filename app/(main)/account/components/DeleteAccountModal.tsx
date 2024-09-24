"use client"

import React, { Dispatch, SetStateAction } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import GenericModal from "@/components/GenericModal";
import Button from "@/components/Button";
import Typography from "@/components/Typography";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  confirmHandler: () => Promise<null>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteAccountModal = ({isOpen, isLoading, confirmHandler, setIsOpen}: Props) => {
  return (
    <GenericModal
      title={
        <Typography
          className="text-xl text-white font-semibold"
          text="Delete account permanently?"
          variant="span"
        />
      }
      description={
        <>
          <div className="flex justify-center items-center gap-1 w-full text-center">
            <AiOutlineWarning className="text-orange-600" size={24} />
            <p className="text-white">
              This action cannot be undone
            </p>
          </div>
          <div className="w-full h-[1px] my-2 bg-neutral-700" />
        </>
      }
      isOpen={isOpen}
      onOpenChange={() => {
        if (isLoading) {
          return false;
        }
        setIsOpen(false);
      }}
    >
      <div className="flex justify-center items-center gap-2">
        <Button
          className="text-white bg-red-700"
          disabled={isLoading}
          onClickHandler={confirmHandler}
        >
          Confirm
        </Button>
        <Button
          className="text-white bg-transparent"
          disabled={isLoading}
          onClickHandler={setIsOpen.bind(null, false)}
        >
          Cancel
        </Button>
      </div>
    </GenericModal>
  )
}

export default DeleteAccountModal;