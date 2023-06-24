"use client"

import { Toaster } from "react-hot-toast";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";

const ToastWrapper = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "text-base font-normal",
        duration: 5000,
        success: {
          icon: <AiOutlineCheckCircle className="text-green-700" size={24} />
        },
        error: {
          icon: <BiError className="text-red-700" size={24} />
        }
      }}
    />
  )
};

export default ToastWrapper;