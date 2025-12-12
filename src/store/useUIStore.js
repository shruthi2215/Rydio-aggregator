import { create } from "zustand";

const useUIStore = create((set) => ({
  theme: "dark",
  isSheetOpen: false,
  safetyChecklist: [false, false, false],
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  toggleSafetyItem: (index, value) =>
    set((state) => {
      const current = state.safetyChecklist || [false, false, false];
      if (index < 0 || index >= current.length) return state;
      const next = [...current];
      next[index] = value !== undefined ? value : !next[index];
      return { safetyChecklist: next };
    }),
  resetSafetyChecklist: () => set({ safetyChecklist: [false, false, false] }),
}));

export default useUIStore;

