"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import { IconType } from "react-icons";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import SidebarPlaylistBtn from "./SidebarPlaylistBtn";
import SongLibrary from "./SongLibrary";
import Button from "./Button";
import usePlayer from "@/hooks/usePlayer";
import useCurrentSession from "@/hooks/useCurrentSession";
import { Database } from "@/types/supabase";
import { Song } from "@/types";

export type RouteItem = {
  label: string;
  Icon: IconType;
  active: boolean;
  href: string;
};

const SidebarContent = () => {
  const currentPageRef = useRef(0);
  const path = usePathname();

  const supabase = useSessionContext();
  const supabaseClient: SupabaseClient<Database> = supabase.supabaseClient;
  const currentSession = supabase.session;

  const {playList} = usePlayer();

  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalSongs, setTotalSongs] = useState(0);

  const {setSession} = useCurrentSession();

  /**
   * Consultar y paginar las canciones
   * previniendo queries duplicados.
   */
  const getSongs = async (page: number, session: Session | null) => {
    try {
      if (!session || page === currentPageRef.current) {
        setLoading(false);
        return;
      };

      
      const PAGE_SIZE = 10;
      const user = session.user;

      
      // Calcular la siguiente página de resultados
      const FROM = PAGE_SIZE * (page - 1);
      const TO = FROM + PAGE_SIZE - 1;
      
      setLoading(true);
      
      const res = await supabaseClient
      .from("songs")
      .select("*", {count: "exact"})
      .eq("user_id", user.id)
      .order("created_at", {ascending: false})
      .range(FROM, TO);

      if (res.error) {
        setLoading(false);
        return toast(res.error.message)
      };

      setLoading(false);
      setTotalSongs(() => res.count || 0);
      setSongs(prev => [...prev, ...res.data!]);

      // Mantener una referencia inmutable de la página actual
      // para prevenir re-renders cuando Supabase vuelva a
      // regenerar la variable session al cambiar el focus de la página.
      currentPageRef.current = page;
      
    } catch (error: any) {
      toast.error(error.message, {position: "bottom-left"});

    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((e, session) => {
      // cargar la primera página de canciones
      // Almacenar la sesión en el state global
      if (e === "SIGNED_IN" || e === "INITIAL_SESSION") {
        setSession(session);
        getSongs(1, session);
      }

      // Limpiar el state de las canciones cuando el usuario cierra sesión
      if (e === "SIGNED_OUT") {
        setSongs([]);
        setSession(null);
      };
    });
  }, []);
  
  
  // Consultar las siguientes páginas de canciones
  // si el usuario está autenticado
  useEffect(() => {
    if (currentSession && page > 1 && page !== currentPageRef.current) {
      getSongs(page, currentSession)
    };

  }, [currentSession, page, currentPageRef]);


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

  const endOfResults = songs.length >= Number(totalSongs);

  return (
    <div className="flex flex-col gap-2 w-[300px] h-full">
      <Box className="w-full">
        <div className="flex flex-col gap-4 px-3 py-4">
          {routes.map(routeItem => {
            return (
              <SidebarItem key={routeItem.label} routeItem={routeItem} />
            );
          })}
        </div>
      </Box>

      {/* Botón para abrir el modal con el playlist */}
      <AnimatePresence>
        {playList.length > 0 &&
          <motion.div
            className="w-full"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
          >
            <SidebarPlaylistBtn />
          </motion.div>
        }
      </AnimatePresence>

      <Box className="flex flex-col justify-start items-stretch h-full pb-10 scrollbar-track-neutral-400 custom-scrollbar overflow-y-auto">
        <SongLibrary userSongs={songs} loading={loading} />

        {currentSession && songs.length > 0 &&
          <Button
            className={twMerge("mt-auto mb-3 mx-auto text-sm", endOfResults && "font-normal text-gray-400 bg-transparent")}
            disabled={loading || endOfResults}
            onClickHandler={() => setPage(prev => prev + 1)}
          >
            {!endOfResults && "Load more"}
            {endOfResults && "No more songs available"}
          </Button>
        }
      </Box>
    </div>
  )
}

export default SidebarContent;