import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface CurrentSession {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

/** State global de la sesión del usuario actual */
const useCurrentSession = create<CurrentSession>((set) => {
  return {
    session: null,
    setSession: (session: Session | null) => set((state) => {
      return {
        ...state,
        session
      }
    })
  }
});

export default useCurrentSession;