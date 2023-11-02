import { create } from "zustand";

type AuthType = "sign_in" | "sign_up";

interface AuthModalState {
  isOpen: boolean;
  authType: AuthType;
  setAuthType: (authType: AuthType) => void;
  onOpenChange: (open: boolean) => void;
};

/** State del modal de autenticación */
const useAuthModal = create<AuthModalState>((set) => {
  return {
    isOpen: false,
    authType: "sign_in",
    setAuthType: (authType: AuthType) => set((state) => {
      return {...state, authType}
    }),
    onOpenChange: (open) => set((state) => {
      return {...state, isOpen: open}
    })
  }
});

export default useAuthModal;