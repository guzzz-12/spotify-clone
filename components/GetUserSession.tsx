"use client"

import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserProvider";
import useCurrentSession from "@/hooks/useCurrentSession"
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";

const GetUserSession = () => {
  const {clearUserData} = useContext(UserContext);

  const supabase = supabaseBrowserClient;
  const {setSession, setLoadingSession} = useCurrentSession(state => state);

  useEffect(() => {
    const getUserSession = async () => {
      try {
        const {data} = await supabase.auth.getSession();

        setSession(data.session);
        
      } catch (error: any) {
        console.log(`Error consultando sesión del usuario`, error.message);

      } finally {
        setLoadingSession(false);
      }
    }

    supabase.auth.onAuthStateChange((e, session) => {
      if ((e === "INITIAL_SESSION" || e === "SIGNED_IN") && session) {
        setSession(session);
      }

      if (e === "SIGNED_OUT") {
        setSession(null);
        clearUserData();
      }

      if (!session) {
        setSession(null);
        clearUserData();
      }
    });

    getUserSession();
  }, []);

  return null
}

export default GetUserSession