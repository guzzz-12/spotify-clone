import { create } from "zustand";

interface PlayerState {
  activeId: number | null;
  playList: number[];
  setActiveId: (songId: number) => void;
  setPlayList: (songIds: number[]) => void;
  resetPlayer: () => void;
};


/** State del reproductor */
const usePlayer = create<PlayerState>((set) => {
  return {
    activeId: null,
    playList: [],
    setActiveId: (songId: number) => set({activeId: songId}),
    setPlayList: (songIds: number[]) => set({playList: songIds}),
    resetPlayer: () => set({activeId: null, playList: []})
  }
});

export default usePlayer;