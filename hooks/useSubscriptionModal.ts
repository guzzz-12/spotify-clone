import { create } from "zustand";

interface SubscriptionModalState {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/** State del modal de suscripción */
const useSubscriptionModal = create<SubscriptionModalState>((set) => {
  return {
    isOpen: false,
    onOpenChange: (open) => set({isOpen: open})
  }
});

export default useSubscriptionModal;