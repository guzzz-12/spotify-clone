"use client"

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaCog } from "react-icons/fa";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import MyUploadedSongs from "./MyUploadedSongs";
import SubscriptionManager from "./SubscriptionManager";
import { Song } from "@/types";
import AccountSecurity from "./AccountSecurity";

interface Props {
  songs: Song[];
}

const AccountsTabs = ({songs}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "songs">("settings");

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Tabs defaultValue={activeTab}>
      <TabsList className="flex justify-start items-center gap-1 mx-4 rounded-md">
        <TabsTrigger
          className={twMerge("px-4 pt-2 pb-3 font-normal text-neutral-300 rounded-t-md transition-colors", activeTab === "settings" && "text-neutral-50 bg-neutral-700")}
          value="settings"
          onClick={() => setActiveTab("settings")}
        >
          <div className="flex justify-center items-center gap-2">
            <FaCog className="w-6 h-6 text-neutral-400" />
            <span className="text-xs uppercase">
              Subscription and Settings
            </span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          className={twMerge("px-4 pt-2 pb-3 font-normal text-neutral-300 rounded-t-md transition-colors", activeTab === "songs" && "text-neutral-50 bg-neutral-700")}
          value="songs"
          onClick={() => setActiveTab("songs")}
        >
          <div className="flex justify-center items-center gap-2">
            <BsMusicNoteBeamed className="w-6 h-6 text-neutral-400" />
            <span className="text-xs uppercase">
              Your Uploaded Songs
            </span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        className="mx-4 mb-7 p-6 border-t border-neutral-500 rounded-b-md bg-neutral-700"
        value="settings"
      >
        <SubscriptionManager />
        <div className="w-full h-[1px] my-6 bg-neutral-600" />
        <AccountSecurity />
      </TabsContent>

      <TabsContent value="songs">
        <MyUploadedSongs userSongs={songs} />
      </TabsContent>
    </Tabs>
  )
}

export default AccountsTabs;