"use client"

import { useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge, ClassNameValue } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";

interface Props {
  children: ReactNode;
  className?: ClassNameValue;
};

const Header = ({children, className}: Props) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const {back, forward} = useRouter();

  const logoutHandler = () => {};

  return (
    <header className={twMerge("h-fit px-5 py-4 bg-gradient-to-b from-emerald-800", className)}>
      <div className="flex justify-between items-center w-full mb-4">
        <div className="hidden items-center gap-2 md:flex">
          <button
            className="flex justify-center items-center rounded-full bg-black transition-all hover:opacity-75"
            onClick={() => back()}
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            className="flex justify-center items-center rounded-full bg-black transition-all hover:opacity-75"
            onClick={() => forward()}
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/" className="flex justify-center items-center p-2 rounded-full bg-white transition-all hover:opacity-75">
            <HiHome size={20} className="text-black" />
          </Link>
          <Link href="/search" className="flex justify-center items-center p-2 rounded-full bg-white transition-all hover:opacity-75">
            <BiSearch size={20} className="text-black" />
          </Link>
        </div>

        <div className="flex justify-between items-center gap-4">
          <>
            <div className="flex justify-between items-center gap-2">
              <Button
                ref={btnRef}
                className="font-base text-white bg-transparent"
                onClickHandler={() => {}}
              >
                Sign up
              </Button>
              <Button
                className="font-base bg-white"
                onClickHandler={logoutHandler}
              >
                Login
              </Button>
            </div>
          </>
        </div>
      </div>

      {children}
    </header>
  )
};

export default Header;