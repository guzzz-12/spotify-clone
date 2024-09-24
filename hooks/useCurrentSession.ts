import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface CurrentSession {
  session: Session | null;
  loadingSession: boolean;
  setSession: (session: Session | null) => void;
  setLoadingSession: (loading: boolean) => void;
}

/** State global de la sesión del usuario actual */
const useCurrentSession = create<CurrentSession>((set) => {
  return {
    session: null,
    loadingSession: true,
    setSession: (session) => set((state) => {
      return {
        ...state,
        session
      }
    }),
    setLoadingSession: (loading) => set(() => ({loadingSession: loading}))
  }
});

export default useCurrentSession;