import { create } from "zustand";

interface SubscriptionModalState {
  isOpen: boolean;
  isUpdate?: boolean;
  onOpenChange: (open: boolean, isUpdate?: boolean) => void;
};

/** State del modal de suscripción */
const useSubscriptionModal = create<SubscriptionModalState>((set) => {
  return {
    isOpen: false,
    isUpdate: false,
    onOpenChange: (open, isUpdate=false) => set({
      isOpen: open,
      isUpdate
    })
  }
});

export default useSubscriptionModal;