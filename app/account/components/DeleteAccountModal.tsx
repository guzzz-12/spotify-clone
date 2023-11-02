"use client"

import React, { Dispatch, SetStateAction } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import GenericModal from "@/components/GenericModal";
import Button from "@/components/Button";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  confirmHandler: () => Promise<null>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteAccountModal = ({isOpen, isLoading, confirmHandler, setIsOpen}: Props) => {
  return (
    <GenericModal
      title="Delete account permanently?"
      description={
        <>
          <div className="flex justify-center items-center gap-2 w-full text-center">
            <AiOutlineWarning className="w-5 h-5 text-orange-600" />
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
          className=""
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