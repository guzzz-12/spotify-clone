"use client"

import { useRef, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge, ClassNameValue } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { AiOutlineUser, AiOutlineMenu } from "react-icons/ai";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/Sheet";
import Button from "./Button";
import SidebarContent from "./SidebarContent";
import useAuthModal from "@/hooks/useAuthModal";
import { UserContext } from "@/context/UserProvider";

interface Props {
  children: ReactNode;
  className?: ClassNameValue;
};

const Header = ({children, className}: Props) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const {back, forward, push, refresh} = useRouter();

  const {user, isLoadingUser} = useContext(UserContext);
  const supabase = useSupabaseClient();
  const {onOpenChange} = useAuthModal();

  const logoutHandler = async () => {
    const {error} = await supabase.auth.signOut();

    refresh();

    if (error) {
      toast.error(`Error logging user out: ${error.message}`)
    }
  };

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
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex justify-center items-center p-2 rounded-full bg-white transition-all hover:opacity-75">
                <AiOutlineMenu size={20} className="text-black" />
              </button>
            </SheetTrigger>
            <SheetContent
              className="w-auto p-0 border-none bg-neutral-900"
              side="left"
            >
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex justify-center items-center p-2 rounded-full bg-white transition-all hover:opacity-75">
            <HiHome size={20} className="text-black" />
          </Link>

          <Link href="/search" className="flex justify-center items-center p-2 rounded-full bg-white transition-all hover:opacity-75">
            <BiSearch size={20} className="text-black" />
          </Link>
        </div>

        {!isLoadingUser &&
          <div className="flex justify-between items-center gap-2">
            {user &&
              <>
                <Tooltip id="account-tooltip" />
                <Button
                  ref={btnRef}
                  className="flex justify-center items-center w-10 h-10 text-black bg-white rounded-full disabled:cursor-not-allowed"
                  data-tooltip-id="account-tooltip"
                  data-tooltip-content="Your Account"
                  disabled={isLoadingUser}
                  onClickHandler={push.bind(null, "/account")}
                >
                  <AiOutlineUser className="w-5 h-5 flex-shrink-0" />
                </Button>
                <Button
                  ref={btnRef}
                  className="font-base text-white bg-transparent disabled:cursor-not-allowed"
                  disabled={isLoadingUser}
                  onClickHandler={logoutHandler}
                >
                  Sign out
                </Button>
              </>
            }

            {!user &&
              <>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    ref={btnRef}
                    className="font-base bg-white disabled:cursor-not-allowed"
                    disabled={isLoadingUser}
                    onClickHandler={() => onOpenChange(true)}
                    >
                    Sign up
                  </Button>
                  <Button
                    className="font-base text-white bg-transparent disabled:cursor-not-allowed"
                    disabled={isLoadingUser}
                    onClickHandler={() => onOpenChange(true)}
                  >
                    Login
                  </Button>
                </div>
              </>
            }
          </div>
        }
      </div>
      {children}
    </header>
  )
};

export default Header;