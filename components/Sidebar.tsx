"use client";

import SidebarContent from "./SidebarContent";

const Sidebar = () => {
  return (
    <aside className="hidden md:block h-full">
      <SidebarContent />
    </aside>
  )
};

export default Sidebar;