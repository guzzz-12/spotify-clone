import { create } from "zustand";

interface AuthModalState {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/** State del modal de autenticación */
const useAuthModal = create<AuthModalState>((set) => {
  return {
    isOpen: false,
    onOpenChange: (open) => set({isOpen: open})
  }
});

export default useAuthModal;