import { create } from "zustand";

interface UpdateModalState {
  updatedSongId: number | null;
  isOpen: boolean;
  setUpdatedSongId: (id: number) => void;
  setIsOpen: (open: boolean) => void;
};

/** State del modal de actualización de canciones */
const useUpdateSongModal = create<UpdateModalState>((set) => {
  return {
    updatedSongId: null,
    isOpen: false,
    setUpdatedSongId: (id) => set({updatedSongId: id}),
    setIsOpen: (open) => set({isOpen: open})
  }
});

export default useUpdateSongModal;