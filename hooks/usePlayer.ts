import { create } from "zustand";

interface PlayerState {
  activeId: number | null;
  playList: number[];
  setActiveId: (songId: number) => void;
  setPlayList: (songIds: number[]) => void;
  addToPlayList: (songId: number) => void;
  removeFromPlayList: (songId: number) => void;
  resetPlayer: () => void;
};


/** State del reproductor */
const usePlayer = create<PlayerState>((set) => {
  return {
    activeId: null,
    playList: [],
    setActiveId: (songId: number) => set({activeId: songId}),
    setPlayList: (songIds: number[]) => set({playList: songIds}),
    addToPlayList: (songId: number) => set((state) => {
      return {...state, playList: [...state.playList, songId]}
    }),
    removeFromPlayList: (songId: number) => set((state) => {
      const filtered = state.playList.filter(id => id !== songId);
      return {...state, playList: filtered}
    }),
    resetPlayer: () => set({activeId: null, playList: []})
  }
});

export default usePlayer;