import create from "zustand";

export const useStore = create((set) => ({
  score: [0, 0],
  pointPlayerOne: () =>
    set((state) => ({ score: [state.score[0] + 1, state.score[1]] })),
  pointPlayerTwo: () =>
    set((state) => ({ score: [state.score[0], state.score[1] + 1] })),
}));
