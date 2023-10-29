import {create} from "zustand";

interface PlaylistModalState {
  isPlaylistOpen: boolean;
  openPlaylist: (open: boolean) => void;
}

/** State del modal del playlist */
const usePlaylistModal = create<PlaylistModalState>((set) => {
  return {
    isPlaylistOpen: false,
    openPlaylist: (open: boolean) => set(state => {
      return {...state, isPlaylistOpen: open}
    })
  }
});

export default usePlaylistModal;