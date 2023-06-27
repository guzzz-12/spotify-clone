"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import SongLibrary from "./SongLibrary";
import { Song } from "@/types";

export type RouteItem = {
  label: string;
  Icon: IconType;
  active: boolean;
  href: string;
};

interface Props {
  userSongs: Song[];
};

const Sidebar = ({userSongs}: Props) => {
  const path = usePathname();

  const routes: RouteItem[] = useMemo(() => {
    return [
      {
        label: "Home",
        Icon: HiHome,
        active: path === "/",
        href: "/"
      },
      {
        label: "Search",
        Icon: BiSearch,
        active: path === "/search",
        href: "/search"
      },
    ]
  }, [path]);

  return (
    <aside className="flex h-full">
      <div className="hidden md:flex flex-col gap-2 w-[300px] h-full">
        <Box>
          <div className="flex flex-col gap-4 px-5 py-4">
            {routes.map(routeItem => {
              return (
                <SidebarItem key={routeItem.label} routeItem={routeItem} />
              );
            })}
          </div>
        </Box>

        <Box className="h-full custom-scrollbar overflow-y-auto">
          <SongLibrary userSongs={userSongs} />
        </Box>
      </div>
    </aside>
  )
};

export default Sidebar;