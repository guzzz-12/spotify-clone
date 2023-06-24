import { create } from "zustand";

interface UploadModalState {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/** State del modal de subida de canciones */
const useUploadModal = create<UploadModalState>((set) => {
  return {
    isOpen: false,
    onOpenChange: (open) => set({isOpen: open})
  }
});

export default useUploadModal;