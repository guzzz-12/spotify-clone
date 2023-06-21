import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { RouteItem } from "./Sidebar";

interface Props {
  routeItem: RouteItem;
};

const SidebarItem = ({routeItem}: Props) => {
  const {label, Icon, active, href} = routeItem;

  return (
    <Link
      href={href}
      className={twMerge("flex items-center gap-4 w-full h-auto py-1 text-base font-medium text-neutral-400 cursor-pointer hover:text-white transition-all", active && "text-white")}
    >
      <Icon size={30} opacity={0.5} />
      <span className="w-full truncate">
        {label}
      </span>
    </Link>
  )
};


export default SidebarItem;